package service

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/EgorTarasov/true-tech/backend/internal/detection/models"
	"github.com/EgorTarasov/true-tech/backend/internal/detection/repository"
	pb "github.com/EgorTarasov/true-tech/backend/internal/gen"
	"github.com/google/uuid"
	"go.opentelemetry.io/otel/trace"
)

type detectionRepository interface {
	CreateSession(ctx context.Context, sessionId uuid.UUID, userId int64) (int64, error)
	CreateQuery(ctx context.Context, userQuery models.DetectionQueryCreate) (int64, error)
	GetLastQueryContent(ctx context.Context, sessionUUID uuid.UUID) (int64, string, error)
}

type service struct {
	domainService pb.DomainDetectionServiceClient
	detectionRepo detectionRepository
	tracer        trace.Tracer
}

func New(_ context.Context, domainService pb.DomainDetectionServiceClient, dr detectionRepository, tracer trace.Tracer) *service {
	return &service{
		domainService: domainService,
		detectionRepo: dr,
		tracer:        tracer,
	}
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
		Content:     "",
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

		slog.Info("session was already created  id:", "sessionId", sessionId, "lastQueryContent", lastQueryContent, "currentQuery", request.Query)
		request.Query = lastQueryContent + " " + request.Query
	}

	// ml model call
	slog.Info("sending request to ml", "query", request.Query)

	ctx, mlSpan := s.tracer.Start(ctx, "ml.DetectDomain")
	resp, err := s.domainService.DetectDomain(ctx, &pb.DomainDetectionRequest{Query: request.Query})
	mlSpan.End()

	if err != nil {
		// TODO: add detection errors
		response.Response = err.Error()
		response.Status = models.NotEnoughParams
		return response, err
	}

	response.Status = models.Success
	response.Content = resp.Label

	lastQueryId, err = s.detectionRepo.CreateQuery(ctx, models.DetectionQueryCreate{
		SessionId:    sessionId,
		Content:      request.Query,
		Label:        resp.Label,
		Status:       response.Status,
		DetectedKeys: nil,
	})
	if err != nil {
		slog.Info("err during saving query", "err", err.Error())
	}

	response.QueryId = lastQueryId

	slog.Info("detection status:", "response label", resp.Label, "session UUID", request.SessionId)

	return response, nil
}
