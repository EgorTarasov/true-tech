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

// InitDetectionRouter инициализация роутера для обработки запросов к ner модели
func InitDetectionRouter(_ context.Context, app *fiber.App, controller mlHandler) error {
	detection := app.Group("/detection")
	detection.Post("/execute", middleware.UserClaimsMiddleware, controller.ExecuteCommand)
	detection.Post("/html", controller.ParsePage)
	return nil
}
