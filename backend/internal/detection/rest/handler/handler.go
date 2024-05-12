package handler

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/auth/token"
	"github.com/EgorTarasov/true-tech/backend/internal/detection/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.opentelemetry.io/otel/trace"
)

type service interface {
	DomainDetection(ctx context.Context, userId int64, request models.DetectionData) (models.DetectionResult, error)
	CreateNewPage(ctx context.Context, page models.PageCreate) (int64, error)
}

type detectHandler struct {
	s      service
	tracer trace.Tracer
}

func NewDetectHandler(_ context.Context, s service, tracer trace.Tracer) *detectHandler {
	return &detectHandler{
		s:      s,
		tracer: tracer,
	}
}

type mlDetectionResponse struct {
	SessionId string                 `json:"sessionId"`
	QueryId   int64                  `json:"queryId"`
	Content   map[string]any         `json:"content"`
	Status    models.DetectionStatus `json:"detectionStatus"`
	Error     string                 `json:"err"` // ошибка, которую можно отобразить пользователю
}

type MlDetectionRequest struct {
	SessionId  string   `json:"sessionId"`
	Query      string   `json:"query"`
	FieldNames []string `json:"names"`
}

// ExecuteCommand godoc
//
//	Обработка команды пользователя и запуск ее выполнения
//
// @Summary Запуск сценария из обработанного текста
// @Description обработка запроса пользователя с разбиением на доступное действие и параметры для его запуска
// @Tags ml
// @Accept  json
// @Produce  json
// @Param data body MlDetectionRequest true "данные для запроса"
// @Success 200 {object} mlDetectionResponse
// @Failure 400 {object} mlDetectionResponse
// @Failure 422
// @Router /detection/execute [post]
func (dc *detectHandler) ExecuteCommand(c *fiber.Ctx) error {
	ctx, span := dc.tracer.Start(c.Context(), "detection.ExecuteCommand")
	defer span.End()
	// получение данных пользователя из jwt response_time
	user := c.Locals("userClaims").(*jwt.Token)

	claims := user.Claims.(*token.UserClaims)

	var request MlDetectionRequest

	err := c.BodyParser(&request)
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"err": err.Error()})
	}

	resp, err := dc.s.DomainDetection(ctx, claims.UserId, models.DetectionData{
		SessionId: request.SessionId,
		Query:     request.Query, Names: request.FieldNames,
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(mlDetectionResponse{
		SessionId: request.SessionId,
		QueryId:   resp.QueryId,
		Content:   resp.Content,
		Status:    resp.Status,
		Error:     resp.Response,
	})
}

// ParsePage godoc
//
//	получение полей из формы
//
// @Summary Получение полей и типов из html страницы
// @Description получение полей и их типов из html страницы
// @Tags ml
// @Accept  json
// @Produce  json
// @Accept  json
// @Param html body models.PageCreate true "html страница"
// @Success 200 {object} mlDetectionResponse
// @Failure 400 {object} mlDetectionResponse
// @Failure 422
// @Router /detection/html [post]
func (dc *detectHandler) ParsePage(c *fiber.Ctx) error {
	ctx, span := dc.tracer.Start(c.Context(), "detection.ParsePage")
	defer span.End()

	var request models.PageCreate
	err := c.BodyParser(&request)
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"err": err.Error()})
	}
	newId, err := dc.s.CreateNewPage(ctx, request)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"id": newId})
}
