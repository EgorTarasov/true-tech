package service

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"regexp"

	"github.com/EgorTarasov/true-tech/backend/internal/detection/models"
	"github.com/EgorTarasov/true-tech/backend/internal/detection/repository"
	pb "github.com/EgorTarasov/true-tech/backend/internal/stubs"
	"github.com/google/uuid"
	"github.com/nyaruka/phonenumbers"
	"github.com/rs/zerolog/log"
	"go.opentelemetry.io/otel/trace"
	"google.golang.org/grpc"
)

type detectionRepository interface {
	CreateSession(ctx context.Context, sessionId uuid.UUID, userId int64) (int64, error)
	CreateQuery(ctx context.Context, userQuery models.DetectionQueryCreate) (int64, error)
	GetLastQueryContent(ctx context.Context, sessionUUID uuid.UUID) (int64, string, error)
}

type actionRepository interface {
	SavePageInfo(ctx context.Context, page models.PageCreate, actions []models.InputField) (int64, error)
	GetPageInfo(ctx context.Context, url string) (models.PageDto, error)
}

type domainGrpcClient interface {
	DetectDomain(ctx context.Context, in *pb.DomainDetectionRequest, opts ...grpc.CallOption) (*pb.DomainDetectionResponse, error)
	ExtractLabels(ctx context.Context, in *pb.LabelDetectionRequest, opts ...grpc.CallOption) (*pb.LabelDetectionResponse, error)
	ExtractFormData(ctx context.Context, in *pb.ExtractFormDataRequest, opts ...grpc.CallOption) (*pb.ExtractFormDataResponse, error)
}

type service struct {
	domainService domainGrpcClient
	detectionRepo detectionRepository
	actionRepo    actionRepository
	tracer        trace.Tracer
}

func New(_ context.Context, domainService pb.DomainDetectionServiceClient, dr detectionRepository, ac actionRepository, tracer trace.Tracer) *service {
	return &service{
		domainService: domainService,
		detectionRepo: dr,
		actionRepo:    ac,
		tracer:        tracer,
	}
}

func formatQuery(query string) string {
	re := regexp.MustCompile(`(\d)[ -](\d)`)
	return re.ReplaceAllStringFunc(query, func(s string) string {
		return string(s[0]) + string(s[2])
	})
}

func getPhoneNumberFromQuery(query string) (string, error) {
	// find first entry of +7 or 7 or 8 in string and remove all numbers before it
	re := regexp.MustCompile(`(\+7|7|8)\d*`)
	match := re.FindString(query)
	if match != "" {
		return match, nil
	}

	// parse our phone number
	num, err := phonenumbers.Parse(query, "RU")
	if err != nil {
		return "", fmt.Errorf("failed to parse phone number: %v", err)
	}

	// format it using national format
	return phonenumbers.Format(num, phonenumbers.NATIONAL), nil
}

// DomainDetection определение запроса пользователя
// TODO: добавить sessionID как входной параметр
// TODO: организовать хранение запросов
// TODO: повторный  запрос
func (s *service) DomainDetection(ctx context.Context, userId int64, request models.DetectionData) (models.DetectionResult, error) {
	ctx, span := s.tracer.Start(ctx, "service.DomainDetection")
	defer span.End()

	response := models.DetectionResult{
		SessionUUID: request.SessionId,
		QueryId:     0,
		Status:      models.InternalErr,
		Content:     make(map[string]any),
		Response:    "", // FIXME как передавать описание ошибки, что нам не хватает полей для такой операции
	}
	var (
		lastQueryContent string
		sessionId        int64
		lastQueryId      int64
	)

	sessionUUID, err := uuid.Parse(request.SessionId)
	if err != nil {
		return response, fmt.Errorf("sessionId is invalid UUID  %v", err)
	}
	// формирование запроса к мл
	sessionId, err = s.detectionRepo.CreateSession(ctx, sessionUUID, userId)
	if err != nil {
		if !errors.As(err, &repository.ErrSessionAlreadyExists) {
			return response, err
		}

		// если сессия уже существует, то получаем последнее сообщение и добавляем в начало запроса
		sessionId, lastQueryContent, err = s.detectionRepo.GetLastQueryContent(ctx, sessionUUID)
		if err != nil {
			return response, err
		}

		slog.Debug("session was already created  id:", "sessionId", sessionId, "lastQueryContent", lastQueryContent, "currentQuery", request.Query)

	}
	request.Query = formatQuery(request.Query)

	// ml model call
	slog.Debug("sending request to ml", "query", request.Query)

	ctx, mlSpan := s.tracer.Start(ctx, "ml.DetectDomain")
	resp, err := s.domainService.DetectDomain(ctx, &pb.DomainDetectionRequest{Query: request.Query})
	mlSpan.End()
	log.Info().Str("ml detection class", resp.Label).Msg("SkillClassifier")

	if err != nil {
		// TODO: add detection errors
		response.Response = err.Error()
		response.Status = models.NotEnoughParams
		return response, err
	}
	//mlResponse := make(map[string]any)
	// create map[string]any from request.Names
	mlResponse := make(map[string]any)
	for _, v := range request.Names {
		mlResponse[v] = ""
	}

	response.Status = models.Success

	ctx, mlSpan = s.tracer.Start(ctx, "ml.ExtractFormData")
	keys, err := s.domainService.ExtractFormData(ctx, &pb.ExtractFormDataRequest{
		Fields: nil,
		Query:  request.Query,
	})
	mlSpan.End()
	if err != nil {
		return response, err
	}

	for _, v := range keys.Fields {
		if _, ok := mlResponse[v.Name]; !ok {
			continue
		}
		mlResponse[v.Name] = v.Value
	}
	phoneNumber, err := getPhoneNumberFromQuery(request.Query)
	if err != nil {
		slog.Debug("failed to parse phone number", "err", err.Error())
	} else {
		mlResponse["mobilianyi_telefon"] = phoneNumber
	}

	// можем достать все детекченные ключи в сессии и собрать один ответ
	// только первый запрос определяет тип платежа / перевода
	lastQueryId, err = s.detectionRepo.CreateQuery(ctx, models.DetectionQueryCreate{
		SessionId:    sessionId,
		Content:      request.Query,
		Label:        resp.Label,
		Status:       response.Status,
		DetectedKeys: mlResponse,
	})
	if err != nil {
		slog.Debug("err during saving query", "err", err.Error())
	}

	//rawJson, _ := json.Marshal(mlResponse)

	response.Content = mlResponse
	response.QueryId = lastQueryId

	slog.Debug("detection status:", "response label", resp.Label, "session UUID", request.SessionId)

	return response, nil
}

// CreateNewPage создание входной формы для страницы
func (s *service) CreateNewPage(ctx context.Context, page models.PageCreate) (int64, error) {
	ctx, span := s.tracer.Start(ctx, "service.CreateNewPage")
	defer span.End()

	response, err := s.domainService.ExtractLabels(ctx, &pb.LabelDetectionRequest{
		Html: page.Html,
	})
	if err != nil {
		return 0, err
	}
	actions := make([]models.InputField, len(response.Labels))
	for i, field := range response.Labels {
		actions[i] = models.InputField{
			Name:        field.Name,
			Type:        field.Type,
			Label:       field.Label,
			PlaceHolder: field.Placeholder,
			InputMode:   field.Inputmode,
			SpellCheck:  field.Splellcheck,
		}
	}

	return s.actionRepo.SavePageInfo(ctx, page, actions)
}
