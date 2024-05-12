package service

import (
	"context"
	"fmt"

	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
)

//type AccountCreate struct {
//	Name     string `json:"name"`
//	CardInfo models.CardInfo
//}

// CreateAccount создание платежного аккаунта
func (s *service) CreateAccount(ctx context.Context, userId int64, name string, cardInfo models.CardInfo) error {
	ctx, span := s.tracer.Start(ctx, "service.CreateAccount")
	defer span.End()

	_, err := s.pa.Create(ctx, userId, name, cardInfo)
	if err != nil {
		return fmt.Errorf("err durung creating account: %v", err)
	}
	return nil
}

// GetAccounts получение платежных аккаунтов пользователя
func (s *service) GetAccounts(ctx context.Context, userId int64) ([]models.PaymentAccountDto, error) {
	ctx, span := s.tracer.Start(ctx, "service.GetAccounts")
	defer span.End()

	accounts, err := s.pa.GetAccounts(ctx, userId)
	if err != nil {
		return nil, err
	}
	result := make([]models.PaymentAccountDto, len(accounts))
	for idx, v := range accounts {
		result[idx] = models.Dto(&v)
	}

	return result, nil
}
