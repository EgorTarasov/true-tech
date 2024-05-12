package service

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
)

type FormRepo interface {
	Create(ctx context.Context, name string, fields []int64) (int64, error)
	List(ctx context.Context) ([]models.FormDao, error)
	Fields(ctx context.Context) ([]models.InputFieldDao, error)
	FormFields(ctx context.Context, formId int64) ([]models.InputFieldDao, error)
}

func (s *service) CreateCustomPayment(ctx context.Context, name string, fields []int64) (int64, error) {
	ctx, span := s.tracer.Start(ctx, "service.CreateCustomPayment")
	defer span.End()

	newId, err := s.fr.Create(ctx, name, fields)
	if err != nil {
		return 0, err
	}
	return newId, err
}

func (s *service) ListCustomPayments(ctx context.Context) ([]models.FormDto, error) {
	ctx, span := s.tracer.Start(ctx, "service.ListCustomPayments")
	defer span.End()
	forms, err := s.fr.List(ctx)
	if err != nil {
		return nil, err
	}
	dtos := make([]models.FormDto, len(forms))
	for idx, form := range forms {
		dtos[idx] = form.ToDto()
	}
	return dtos, nil
}

func (s *service) ListAvailableFields(ctx context.Context) ([]models.InputFieldDto, error) {
	ctx, span := s.tracer.Start(ctx, "service.ListAvailableFields")
	defer span.End()

	fields, err := s.fr.Fields(ctx)
	if err != nil {
		return nil, err
	}
	dtos := make([]models.InputFieldDto, len(fields))
	for idx, field := range fields {
		dtos[idx] = field.ToDto()
	}
	return dtos, nil
}
