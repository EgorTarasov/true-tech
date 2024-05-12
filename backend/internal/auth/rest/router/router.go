package router

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/auth/rest/middleware"

	"github.com/gofiber/fiber/v2"
)

type handler interface {
	LoginWithEmail(c *fiber.Ctx) error
	CreateAccountWithEmail(c *fiber.Ctx) error
	AuthWithEmail(c *fiber.Ctx) error
	GetUserData(c *fiber.Ctx) error
	AuthWithVk(c *fiber.Ctx) error
}

func InitAuthRouter(_ context.Context, app *fiber.App, authHandler handler) error {

	auth := app.Group("/auth")
	auth.Post("/login", authHandler.AuthWithEmail)
	auth.Post("/register", authHandler.CreateAccountWithEmail)
	auth.Get("/me", middleware.UserClaimsMiddleware, authHandler.GetUserData)
	auth.Post("/vk", authHandler.AuthWithVk)
	auth.Post("/password-code", func(ctx *fiber.Ctx) error {
		return nil
	})
	return nil

}
