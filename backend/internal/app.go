package internal

import (
	"context"
	"flag"
	"fmt"
	"strings"
	"sync"

	accountsPostgresRepository "github.com/EgorTarasov/true-tech/backend/internal/accounts/repository/postgres"
	accountsHandler "github.com/EgorTarasov/true-tech/backend/internal/accounts/rest/handler"
	accountsRouter "github.com/EgorTarasov/true-tech/backend/internal/accounts/rest/router"
	accountsService "github.com/EgorTarasov/true-tech/backend/internal/accounts/service"
	authModels "github.com/EgorTarasov/true-tech/backend/internal/auth/models"
	authPostgresRepository "github.com/EgorTarasov/true-tech/backend/internal/auth/repository/postgres"
	authRedisRepository "github.com/EgorTarasov/true-tech/backend/internal/auth/repository/redis"
	authHandler "github.com/EgorTarasov/true-tech/backend/internal/auth/rest/handler"
	authRouter "github.com/EgorTarasov/true-tech/backend/internal/auth/rest/router"
	authSsrvice "github.com/EgorTarasov/true-tech/backend/internal/auth/service"
	"github.com/EgorTarasov/true-tech/backend/internal/config"

	detectionPostgresRepository "github.com/EgorTarasov/true-tech/backend/internal/detection/repository/postgres"
	detectionHandler "github.com/EgorTarasov/true-tech/backend/internal/detection/rest/handler"
	detectionRouter "github.com/EgorTarasov/true-tech/backend/internal/detection/rest/router"
	detectionService "github.com/EgorTarasov/true-tech/backend/internal/detection/service"
	_ "github.com/EgorTarasov/true-tech/backend/internal/docs"
	pb "github.com/EgorTarasov/true-tech/backend/internal/gen"
	"github.com/EgorTarasov/true-tech/backend/internal/metrics"
	"github.com/EgorTarasov/true-tech/backend/pkg/db"
	"github.com/EgorTarasov/true-tech/backend/pkg/redis"
	"github.com/EgorTarasov/true-tech/backend/pkg/telemetry"
	"github.com/go-webauthn/webauthn/webauthn"
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
	appName := "api-dev"
	cfg := config.MustNew("config.yaml")
	if *dockerMode {
		cfg.Telemetry.OTLPEndpoint = "jaeger:4318"
		cfg.Redis.Host = "redis"
		cfg.Database.Host = "database"
		appName = "api-prod"
	}

	// Tracing with open telemetry

	traceExporter, err := telemetry.NewOTLPExporter(ctx, cfg.Telemetry.OTLPEndpoint)
	if err != nil {
		return fmt.Errorf("err during: %v", err.Error())
	}
	traceProvider := telemetry.NewTraceProvider(traceExporter, appName)

	tracer := traceProvider.Tracer("http-application")

	pg, err := db.NewDb(ctx, cfg.Database, tracer)
	if err != nil {
		return fmt.Errorf("err during db init: %v", err.Error())
	}

	r := redis.New[authModels.UserDao](cfg.Redis)

	//webAuthn
	var webAuthn *webauthn.WebAuthn
	webAuthCfg := &webauthn.Config{
		RPDisplayName: "True Tech Demo",       // Display Name for your site
		RPID:          "mts.larek.tech",       // Generally the FQDN for your site
		RPOrigins:     cfg.Server.CorsOrigins, // The origin URLs allowed for WebAuthn requests
	}

	if webAuthn, err = webauthn.New(webAuthCfg); err != nil {
		fmt.Println(err)
	}

	fmt.Println(webAuthn)

	// ml init
	var grpcOpts []grpc.DialOption
	grpcOpts = append(grpcOpts, grpc.WithTransportCredentials(insecure.NewCredentials()))
	domainDetectionConn, err := grpc.NewClient(fmt.Sprintf("%s:%d", cfg.DomainService.Host, cfg.DomainService.Port), grpcOpts...)
	if err != nil {
		return fmt.Errorf("err during speechService init %v", err.Error())
	}

	domainClient := pb.NewDomainDetectionServiceClient(domainDetectionConn)

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

	//app.Use(response_time.New())

	// Changing TimeZone & TimeFormat
	app.Use(logger.New(logger.Config{
		Format: "${pid} [${ip}]:${port} ${status} - ${method} ${path} ${latency}​\n",
		//Format:     "${pid} ${status} - ${method} ${path}\n",
		TimeFormat: "02-Jan-2006",
		TimeZone:   "Europe/Moscow",
	}))

	// swagger
	app.Get("/swagger/*", fiberSwagger.WrapHandler)

	// auth route group

	userRepo := authPostgresRepository.NewUserRepo(pg, tracer)
	tokenRepo := authRedisRepository.New(ctx, r, tracer)
	s := authSsrvice.New(ctx, cfg, userRepo, tokenRepo, tracer)
	controller := authHandler.NewAuthController(ctx, s, tracer)

	if err = authRouter.InitAuthRouter(ctx, app, controller); err != nil {
		return fmt.Errorf("err during auth router init: %v", err.Error())
	}

	// ml routes

	detectionRepository := detectionPostgresRepository.NewDetectionRepo(pg, tracer)
	mlService := detectionService.New(ctx, domainClient, detectionRepository, tracer)
	detectionController := detectionHandler.NewDetectHandler(ctx, mlService, tracer)

	if err = detectionRouter.InitDetectionRouter(ctx, app, detectionController); err != nil {
		return fmt.Errorf("err during detection router init %v", err.Error())
	}

	// accounts routes

	accountsRepository := accountsPostgresRepository.NewPaymentAccountRepo(pg, tracer)
	accountService := accountsService.New(cfg, accountsRepository, tracer)
	accountsController := accountsHandler.New(accountService, tracer)

	if err = accountsRouter.InitAccountsRouter(ctx, app, accountsController); err != nil {
		return fmt.Errorf("err during accounts router init")
	}

	// Запуск метрик сервиса
	go metrics.RunPrometheus(ctx, 9991)

	if err = app.Listen(fmt.Sprintf(":%d", cfg.Server.Port)); err != nil {
		return fmt.Errorf("err durung server: %v", err.Error())
	}
	return nil
}
