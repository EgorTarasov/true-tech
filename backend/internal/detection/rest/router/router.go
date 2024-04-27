package router

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/config"
	"github.com/EgorTarasov/true-tech/backend/internal/detection/rest/handler"
	"github.com/EgorTarasov/true-tech/backend/internal/detection/service"
	pb "github.com/EgorTarasov/true-tech/backend/internal/gen"
	"github.com/EgorTarasov/true-tech/backend/pkg/db"
	"github.com/gofiber/fiber/v2"
	"go.opentelemetry.io/otel/trace"
)

// TODO: вынести client
func InitDetectionRouter(ctx context.Context, app *fiber.App, cfg *config.Config, _ *db.Database, speechServiceClient pb.SpeechServiceClient, tracer trace.Tracer) error {
	s := service.New(ctx, speechServiceClient)
	controller := handler.NewDetectHandler(ctx, s, tracer)

	detection := app.Group("/detect")
	detection.Post("/test", controller.Test)
	return nil
}
