package service

import (
	"context"
	"errors"

	"github.com/EgorTarasov/true-tech/backend/internal/auth/models"
	"github.com/EgorTarasov/true-tech/backend/internal/auth/token"
	"golang.org/x/crypto/bcrypt"
)

type EmailUserRepo interface {
	Create(ctx context.Context, user models.UserCreate) (int64, error)
	GetById(ctx context.Context, id int64) (models.UserDao, error)
	CreateEmail(ctx context.Context, userId int64, email, password, ip string) error
	GetPasswordHash(ctx context.Context, email string) (int64, string, error)
	UpdateEmailUsage(ctx context.Context, userId int64, ip string) error
}

// CreateUserEmail создание аккаунта пользователя с использованием email + паролю
func (s *service) CreateUserEmail(ctx context.Context, data models.UserCreate, email, password, ip string) (string, error) {
	ctx, span := s.tracer.Start(ctx, "service.CreateUserEmail")
	defer span.End()

	id, err := s.ur.Create(ctx, data)
	if err != nil {
		return "", err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return "", err
	}

	err = s.ur.CreateEmail(ctx, id, email, string(hash), ip)
	if err != nil {
		return "", err
	}

	//// создание токена по id пользователя
	user, err := s.ur.GetById(ctx, id)
	if err != nil {
		return "", err
	}

	accessToken, err := token.Encode(ctx, token.UserPayload{
		UserId:   user.Id,
		AuthType: "email",
		Role:     user.Role,
	})
	if err != nil {
		return "", err
	}

	return accessToken, nil
}

// AuthorizeEmail авторизация в приложении с использованием email + пароль
func (s *service) AuthorizeEmail(ctx context.Context, email, password, ip string) (string, error) {
	ctx, span := s.tracer.Start(ctx, "service.AuthorizeEmail")
	defer span.End()
	id, pswd, err := s.ur.GetPasswordHash(ctx, email)
	if err != nil {
		return pswd, err
	}
	if err = bcrypt.CompareHashAndPassword([]byte(pswd), []byte(password)); err != nil {
		return pswd, errors.New("invalid password")
	}

	err = s.ur.UpdateEmailUsage(ctx, id, ip)

	// создание jwt payload
	user, err := s.ur.GetById(ctx, id)
	if err != nil {
		return "", err
	}

	accessToken, err := token.Encode(ctx, token.UserPayload{
		UserId:   user.Id,
		AuthType: "email",
		Role:     user.Role,
	})
	if err != nil {
		return "", err
	}

	return accessToken, nil
}
