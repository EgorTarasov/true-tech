package service

import (
	"context"
	"errors"
	"time"

	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
	"github.com/EgorTarasov/true-tech/backend/internal/accounts/repository"
)

// TopUpMobilePhoneUnauthorized пополнение счета телефона у мобильных операторов
// returns transactionId, error
func (s *service) TopUpMobilePhoneUnauthorized(ctx context.Context, request models.PhoneRefillDataWithCardData) (int64, error) {
	ctx, span := s.tracer.Start(ctx, "service.TopUpMobilePhoneUnauthorized")
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

	transactionId, err := s.pa.WithDraw(ctx, accountId, request.PhoneData.Amount, map[string]interface{}{"phone": request.PhoneData.Number})

	go func(transactionId int64) {
		time.Sleep(2 * time.Second)
		_ = s.pa.FinishWithDraw(context.Background(), transactionId)
	}(transactionId)

	if err != nil {
		return 0, err
	}
	return transactionId, nil
}

// TopUpMobilePhone пополнение счета телефона у мобильных операторов
// returns transactionId, error
func (s *service) TopUpMobilePhone(ctx context.Context, request models.PhoneRefillDataWithAccountId) (int64, error) {
	ctx, span := s.tracer.Start(ctx, "service.TopUpMobilePhone")
	defer span.End()

	transactionId, err := s.pa.WithDraw(ctx, request.AccountId, request.PhoneData.Amount, map[string]interface{}{"phone": request.PhoneData.Number})
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
