package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/EgorTarasov/true-tech/backend/internal/auth/models"
	"github.com/EgorTarasov/true-tech/backend/internal/auth/repository"
	"github.com/EgorTarasov/true-tech/backend/internal/auth/token"
	"github.com/EgorTarasov/true-tech/backend/internal/config"
	"github.com/EgorTarasov/true-tech/backend/internal/shared/constants"
	"go.opentelemetry.io/otel/trace"
	"golang.org/x/crypto/bcrypt"
)

type UserRepo interface {
	Create(ctx context.Context, user models.UserCreate) (int64, error)
	GetById(ctx context.Context, id int64) (models.UserDao, error)
	CreateEmail(ctx context.Context, userId int64, email, password, ip string) error
	GetPasswordHash(ctx context.Context, email string) (int64, string, error)
	UpdateEmailUsage(ctx context.Context, userId int64, ip string) error
	GetVkUserData(ctx context.Context, vkId int64) (models.UserDao, error)
	SaveVkUserData(ctx context.Context, userData models.VkUserData) error
	UpdateVkUserData(ctx context.Context, userData models.VkUserData) error
}

type TokenRepo interface {
	Set(ctx context.Context, token string, data models.UserDao) error
	Get(ctx context.Context, token string) (models.UserDao, error)
}

type service struct {
	tracer trace.Tracer
	cfg    *config.Config
	ur     UserRepo
	tr     TokenRepo
}

func New(_ context.Context, cfg *config.Config, userRepo UserRepo, tokenRepo TokenRepo, tracer trace.Tracer) *service {
	return &service{
		cfg:    cfg,
		tracer: tracer,
		ur:     userRepo,
		tr:     tokenRepo,
	}
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

// AuthorizeVk авторизация через vk mini apps
// https://dev.vk.com/ru/mini-apps/getting-started
// использует старое API с возможностью получения ФИО + групп пользователя
func (s *service) AuthorizeVk(ctx context.Context, accessCode string) (string, error) {
	ctx, span := s.tracer.Start(ctx, "service.AuthorizeVk")
	defer span.End()

	vkResponse, err := s.getVkUserData(ctx, accessCode)
	if err != nil {
		return "", fmt.Errorf("err during vk auth: %v", err.Error())
	}
	vkUserData := vkResponse.Response[0]
	// проверяем есть ли уже запись с таким пользователем
	user, err := s.ur.GetVkUserData(ctx, vkUserData.ID)
	if err != nil && errors.Is(err, repository.ErrVkUserNotFound) {
		// аккаунт пользователя не найден создаем новый аккаунт
		id, vkErr := s.ur.Create(ctx, models.UserCreate{
			FirstName: vkUserData.FirstName,
			LastName:  vkUserData.LastName,
			Role:      constants.User,
		})
		if vkErr != nil {
			return "", vkErr
		}
		//D.M.YYYY

		vkErr = s.ur.SaveVkUserData(ctx, models.VkUserData{
			UserId:    id,
			VkId:      vkUserData.ID,
			FirstName: vkUserData.FirstName,
			LastName:  vkUserData.LastName,
			BirthDate: parseBirthDate(vkUserData.Bdate),
			City:      vkUserData.City.Title,
			Photo:     vkUserData.Photo200,
			Sex:       vkUserData.Sex,
		})
		user, vkErr = s.ur.GetVkUserData(ctx, vkUserData.ID)
		if vkErr != nil {
			return "", vkErr
		}
	} else if err != nil {
		return "", err
	} else {

	}

	accessToken, err := token.Encode(ctx, token.UserPayload{
		UserId:   user.Id,
		AuthType: "vk",
		Role:     user.Role,
	})

	return accessToken, nil
}
