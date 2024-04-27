package handler

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"go.opentelemetry.io/otel/trace"
)

type service interface {
	Detect(ctx context.Context, audio []byte) (string, error)
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

// Test godoc  Тестовая ручка для запуска whisper
//
// Запускает обработку через whisper
func (dc *detectHandler) Test(c *fiber.Ctx) error {
	ctx, span := dc.tracer.Start(c.Context(), "detection.Test")
	defer span.End()

	formData, err := c.FormFile("audio")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": err.Error()})
	}
	file, err := formData.Open()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": err.Error()})
	}
	var rawBytes []byte
	if _, err = file.Read(rawBytes); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": err.Error()})
	}

	text, err := dc.s.Detect(ctx, rawBytes)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"text": text})
}
