package redis

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/pkg/redis"
	"github.com/go-webauthn/webauthn/webauthn"
	"go.opentelemetry.io/otel/trace"
)

type webAuthSessionRepo struct {
	r      *redis.Redis[webauthn.SessionData]
	tracer trace.Tracer
}

// NewWebAuthSessionRepo создание репозитория для токенов авторизации
func NewWebAuthSessionRepo(r *redis.Redis[webauthn.SessionData], tracer trace.Tracer) *webAuthSessionRepo {
	return &webAuthSessionRepo{
		r:      r,
		tracer: tracer,
	}
}

// Set сохраняет данные webauth сессии
func (tr *webAuthSessionRepo) Set(ctx context.Context, data *webauthn.SessionData) error {
	ctx, span := tr.tracer.Start(ctx, "webAuthSessionRepo.Set")
	defer span.End()
	return tr.r.Set(ctx, string(data.UserID), *data)
}

// Get получения данных по id пользователя
func (tr *webAuthSessionRepo) Get(ctx context.Context, userID []byte) (*webauthn.SessionData, error) {
	ctx, span := tr.tracer.Start(ctx, "webAuthSessionRepo.Get")
	defer span.End()
	data, err := tr.r.Get(ctx, string(userID))
	return &data, err
}
