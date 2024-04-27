package internal

import (
	"context"
	"flag"
	"fmt"
	"strings"
	"sync"

	"github.com/EgorTarasov/true-tech/backend/internal/auth/models"
	authRouter "github.com/EgorTarasov/true-tech/backend/internal/auth/rest/router"
	"github.com/EgorTarasov/true-tech/backend/internal/config"
	detectionRouter "github.com/EgorTarasov/true-tech/backend/internal/detection/rest/router"
	_ "github.com/EgorTarasov/true-tech/backend/internal/docs"
	pb "github.com/EgorTarasov/true-tech/backend/internal/gen"
	"github.com/EgorTarasov/true-tech/backend/internal/metrics"
	"github.com/EgorTarasov/true-tech/backend/pkg/db"
	"github.com/EgorTarasov/true-tech/backend/pkg/redis"
	"github.com/EgorTarasov/true-tech/backend/pkg/telemetry"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	fiberSwagger "github.com/swaggo/fiber-swagger"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
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

	// ml init
	var grpcOpts []grpc.DialOption
	grpcOpts = append(grpcOpts, grpc.WithTransportCredentials(insecure.NewCredentials()))
	speechConn, err := grpc.NewClient("speech-to-text:10000", grpcOpts...)
	if err != nil {
		return fmt.Errorf("err during speechService init %v", err.Error())
	}

	speechClient := pb.NewSpeechServiceClient(speechConn)

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

	// ml
	if err = detectionRouter.InitDetectionRouter(ctx, app, cfg, pg, speechClient, tracer); err != nil {
		return fmt.Errorf("err during detection router init %v", err.Error())
	}

	// Запуск метрик сервиса
	go metrics.RunPrometheus(ctx, 9991)

	if err = app.Listen(fmt.Sprintf(":%d", cfg.Server.Port)); err != nil {
		return fmt.Errorf("err durung server: %v", err.Error())
	}
	return nil
}
