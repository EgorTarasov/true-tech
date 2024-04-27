package internal

import (
	"context"
	"flag"
	"fmt"
	"strings"
	"sync"

	"github.com/EgorTarasov/true-tech/internal/auth/models"
	authRouter "github.com/EgorTarasov/true-tech/internal/auth/rest/router"
	"github.com/EgorTarasov/true-tech/internal/config"
	_ "github.com/EgorTarasov/true-tech/internal/docs"
	"github.com/EgorTarasov/true-tech/internal/metrics"
	"github.com/EgorTarasov/true-tech/pkg/db"
	"github.com/EgorTarasov/true-tech/pkg/redis"
	"github.com/EgorTarasov/true-tech/pkg/telemetry"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	fiberSwagger "github.com/swaggo/fiber-swagger"
)

func Run(ctx context.Context, _ *sync.WaitGroup) error {
	var (
		dockerMode = flag.Bool("docker", false, "updates cfg hostnames for docker")
	)
	flag.Parse()

	// TODO: define flags for features
	cfg := config.MustNew("config.yaml")

	if *dockerMode {
		cfg.Telemetry.OTLPEndpoint = "jaeger:4318"
		cfg.Redis.Host = "redis"
		cfg.Database.Host = "postgres"
	}

	traceExporter, err := telemetry.NewOTLPExporter(ctx, cfg.Telemetry.OTLPEndpoint)
	if err != nil {
		return fmt.Errorf("err during: %v", err.Error())
	}
	traceProvider := telemetry.NewTraceProvider(traceExporter)
	tracer := traceProvider.Tracer("http-application")

	pg, err := db.NewDb(ctx, &cfg.Database, tracer)
	if err != nil {
		return fmt.Errorf("err during db init: %v", err.Error())
	}

	r := redis.New[models.UserDao](cfg.Redis)

	// fiber init
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: strings.Join(cfg.Server.CorsOrigins, ","),
		AllowMethods: strings.Join([]string{
			fiber.MethodGet,
			fiber.MethodPost,
			fiber.MethodHead,
			fiber.MethodPut,
			fiber.MethodDelete,
			fiber.MethodPatch,
		}, ","),
		AllowHeaders:     "*",
		AllowCredentials: true,
	}))

	// Changing TimeZone & TimeFormat
	app.Use(logger.New(logger.Config{
		Format:     "${pid} ${status} - ${method} ${path}\n",
		TimeFormat: "02-Jan-2006",
		TimeZone:   "Europe/Moscow",
	}))

	// swagger
	app.Get("/swagger/*", fiberSwagger.WrapHandler)

	// инициализация group
	if err = authRouter.InitAuthRouter(ctx, app, *cfg, pg, r, tracer); err != nil {
		return fmt.Errorf("err during auth router init: %v", err.Error())
	}

	// Запуск метрик сервиса
	go metrics.RunPrometheus(ctx, 9991)

	if err = app.Listen(fmt.Sprintf(":%d", cfg.Server.Port)); err != nil {
		return fmt.Errorf("err durung server: %v", err.Error())
	}
	return nil
}
