package router

import (
	"context"

	"github.com/EgorTarasov/true-tech/internal/auth/models"
	"github.com/EgorTarasov/true-tech/internal/auth/repository/postgres"
	"github.com/EgorTarasov/true-tech/internal/auth/repository/redis"
	"github.com/EgorTarasov/true-tech/internal/auth/rest/middleware"
	"github.com/EgorTarasov/true-tech/internal/config"
	infra "github.com/EgorTarasov/true-tech/pkg/redis"

	"github.com/EgorTarasov/true-tech/internal/auth/rest/handler"
	"github.com/EgorTarasov/true-tech/internal/auth/service"
	"github.com/EgorTarasov/true-tech/pkg/db"
	"github.com/gofiber/fiber/v2"
	"go.opentelemetry.io/otel/trace"
)

// TODO: implement auth router with next groups of endpoints
// "basic auth"  - auth via email + password
// "vk auth" - via vk id like gagarin hack
// saves some user data like:
// first, last name
// bdate, city
// "ya id"???

func InitAuthRouter(ctx context.Context, app *fiber.App, cfg config.Config, pg *db.Database, r *infra.Redis[models.UserDao], tracer trace.Tracer) error {
	// TODO: tracing
	// TODO: auth handler
	userRepo := postgres.NewUserRepo(pg, tracer)
	tokenRepo := redis.New(ctx, r, tracer)
	s := service.New(ctx, cfg, userRepo, tokenRepo, tracer)
	controller := handler.NewAuthController(ctx, s, tracer)

	auth := app.Group("/auth")
	auth.Post("/login", controller.AuthWithEmail)
	auth.Post("/register", controller.CreateAccountWithEmail)
	auth.Get("/me", middleware.UserClaimsMiddleware, controller.GetUserData)
	auth.Post("/vk", controller.AuthWithVk)
	auth.Post("/password-code", func(ctx *fiber.Ctx) error {
		return nil
	})
	return nil

}
