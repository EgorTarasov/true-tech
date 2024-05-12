package service

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/auth/models"
	"github.com/EgorTarasov/true-tech/backend/internal/config"
	"github.com/go-webauthn/webauthn/webauthn"
	"go.opentelemetry.io/otel/trace"
)

type TokenRepo interface {
	Set(ctx context.Context, token string, data models.UserDao) error
	Get(ctx context.Context, token string) (models.UserDao, error)
}

type UserRepo interface {
	VkUserRepo
	EmailUserRepo
}

type service struct {
	tracer  trace.Tracer
	cfg     *config.Config
	ur      UserRepo
	tr      TokenRepo
	webAuth *webauthn.WebAuthn
}

func New(_ context.Context, cfg *config.Config, userRepo UserRepo, tokenRepo TokenRepo, tracer trace.Tracer) *service {
	return &service{
		cfg:    cfg,
		tracer: tracer,
		ur:     userRepo,
		tr:     tokenRepo,
	}
}
