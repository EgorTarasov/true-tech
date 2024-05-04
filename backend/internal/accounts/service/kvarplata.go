package service

import (
	"context"
	"errors"
	"time"

	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
	"github.com/EgorTarasov/true-tech/backend/internal/accounts/repository"
)

// ЖКХ москвы
// Мос Энерго сбыт

// HPUPaymentUnauthorized
// Оплата услуг ЖКХ с использованием данных банковской карты
func (s *service) HPUPaymentUnauthorized(ctx context.Context, request models.HPUWithCardData) (int64, error) {
	ctx, span := s.tracer.Start(ctx, "service.HPUPaymentUnauthorized")
	defer span.End()

	// проверить, если есть аккаунт с такими данными карты
	// если нет, то создать
	accountId, err := s.pa.GetAccount(ctx, request.BankCardInfo)
	if errors.Is(err, repository.ErrAccountNotFound) {
		accountId, err = s.pa.CreateWithOutUser(ctx, request.BankCardInfo)
		if err != nil {
			return 0, err
		}
	}

	transactionId, err := s.pa.WithDraw(ctx, accountId, request.Hpu.Amount, map[string]interface{}{"hpu": request.Hpu})

	go func(transactionId int64) {
		time.Sleep(2 * time.Second)
		_ = s.pa.FinishWithDraw(context.Background(), transactionId)
	}(transactionId)

	if err != nil {
		return 0, err
	}
	return transactionId, nil
}

// HPUPayment
// Оплата услуг ЖКХ с использованием платежного аккаунта
func (s *service) HPUPayment(ctx context.Context, request models.HPUWithAccountId) (int64, error) {
	ctx, span := s.tracer.Start(ctx, "service.HPUPayment")
	defer span.End()

	transactionId, err := s.pa.WithDraw(ctx, request.AccountId, request.Hpu.Amount, map[string]interface{}{"hpu": request.Hpu})
	if err != nil {
		return 0, err
	}
	// имитирует апи запрос к другому сервису
	go func(transactionId int64) {
		time.Sleep(2 * time.Second)
		_ = s.pa.FinishWithDraw(context.Background(), transactionId)
	}(transactionId)

	return transactionId, nil
}
