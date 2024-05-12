package service

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
	"github.com/EgorTarasov/true-tech/backend/internal/config"
	"go.opentelemetry.io/otel/trace"
)

type PaymentAccountRepo interface {
	Create(ctx context.Context, userId int64, name string, cardInfo models.CardInfo) (int64, error)
	CreateWithOutUser(ctx context.Context, cardInfo models.CardInfo) (int64, error)
	GetAccounts(ctx context.Context, userId int64) ([]models.PaymentAccountDao, error)
	GetAccount(ctx context.Context, cardInfo models.CardInfo) (int64, error)
	Replenishment(ctx context.Context, accountId int64, amount int64, metadata map[string]any) (int64, error)
	FinishReplenishment(ctx context.Context, transactionId int64) error
	WithDraw(ctx context.Context, accountId int64, amount int64, metadata map[string]any) (int64, error)
	FinishWithDraw(ctx context.Context, transactionId int64) error
}

type service struct {
	tracer trace.Tracer
	cfg    *config.Config
	pa     PaymentAccountRepo
	fr     FormRepo
}

func New(cfg *config.Config, paymentRepo PaymentAccountRepo, formRepo FormRepo, tracer trace.Tracer) *service {
	return &service{
		tracer: tracer,
		cfg:    cfg,
		pa:     paymentRepo,
		fr:     formRepo,
	}
}
