package handler

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"go.opentelemetry.io/otel/trace"
)

type service interface {
}

type detectController struct {
	s      service
	tracer trace.Tracer
}

func NewDetectController(_ context.Context, s service, tracer trace.Tracer) *detectController {
	return &detectController{
		s:      s,
		tracer: tracer,
	}
}

// Test godoc  Тестовая ручка для запуска whisper
//
// Запускает обработку через whisper
func (dc *detectController) Test(c *fiber.Ctx) error {

	return nil
}
