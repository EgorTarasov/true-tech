package redis

import (
	"context"

	"github.com/EgorTarasov/true-tech/internal/auth/models"
	"github.com/EgorTarasov/true-tech/pkg/redis"
	"go.opentelemetry.io/otel/trace"
)

type tokenRepo struct {
	r      *redis.Redis[models.UserDao]
	tracer trace.Tracer
}

// New создание репозитория для токенов авторизации
func New(_ context.Context, r *redis.Redis[models.UserDao], tracer trace.Tracer) *tokenRepo {
	return &tokenRepo{
		r:      r,
		tracer: tracer,
	}
}

// Set сохраняет данные пользователя с токеном
func (tr *tokenRepo) Set(ctx context.Context, token string, data models.UserDao) error {
	ctx, span := tr.tracer.Start(ctx, "tokenRepo.Set")
	defer span.End()
	return tr.r.Set(ctx, token, data)
}

// Get получения данных по токену
func (tr *tokenRepo) Get(ctx context.Context, token string) (models.UserDao, error) {
	ctx, span := tr.tracer.Start(ctx, "tokenRepo.Get")
	defer span.End()
	return tr.r.Get(ctx, token)
}
