package router

import (
	"context"

	"github.com/EgorTarasov/true-tech/internal/config"
	"github.com/EgorTarasov/true-tech/pkg/db"
	"github.com/gofiber/fiber/v2"
	"go.opentelemetry.io/otel/trace"
)

func InitDetectionRouter(ctx context.Context, app *fiber.App, cfg *config.Config, pg *db.Database, tracer trace.Tracer) error {
	detection := app.Group("/detect")
	detection.Post("/test", func(ctx *fiber.Ctx) error {

		return nil
	})
	return nil
}
