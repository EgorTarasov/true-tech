package handler

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
	"go.opentelemetry.io/otel/trace"
)

// TODO: split interface

type accountService interface {
	CreateAccount(ctx context.Context, userId int64, name string, cardInfo models.CardInfo) error
	GetAccounts(ctx context.Context, userId int64) ([]models.PaymentAccountDto, error)
	TopUpMobilePhoneUnauthorized(ctx context.Context, request models.PhoneRefillDataWithCardData) (int64, error)
	TopUpMobilePhone(ctx context.Context, request models.PhoneRefillDataWithAccountId) (int64, error)
	HPUPaymentUnauthorized(ctx context.Context, request models.HPUWithCardData) (int64, error)
	HPUPayment(ctx context.Context, request models.HPUWithAccountId) (int64, error)
}

type handler struct {
	s      accountService
	tracer trace.Tracer
}

func New(s accountService, tracer trace.Tracer) *handler {
	return &handler{
		s:      s,
		tracer: tracer,
	}
}
