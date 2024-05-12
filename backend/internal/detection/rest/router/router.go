package router

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/auth/rest/middleware"
	"github.com/gofiber/fiber/v2"
)

type mlHandler interface {
	ExecuteCommand(c *fiber.Ctx) error
	ParsePage(c *fiber.Ctx) error
}

// func InitDetectionRouter(ctx context.Context, app *fiber.App, cfg *config.Config, pg *db.Database, speechServiceClient pb.DomainDetectionServiceClient, tracer trace.Tracer) error {
func InitDetectionRouter(_ context.Context, app *fiber.App, controller mlHandler) error {
	detection := app.Group("/detection")
	detection.Post("/execute", middleware.UserClaimsMiddleware, controller.ExecuteCommand)
	detection.Post("/html", controller.ParsePage)
	return nil
}
