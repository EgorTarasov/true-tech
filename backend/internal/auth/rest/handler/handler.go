package handler

import (
	"context"

	"github.com/EgorTarasov/true-tech/internal/auth/models"
	"github.com/EgorTarasov/true-tech/internal/auth/token"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.opentelemetry.io/otel/trace"
)

type service interface {
	CreateUserEmail(ctx context.Context, data models.UserCreate, email, password, ip string) (string, error)
	AuthorizeEmail(ctx context.Context, email, password, ip string) (string, error)
	AuthorizeVk(ctx context.Context, accessCode string) (string, error)
}

type authController struct {
	s      service
	tracer trace.Tracer
}

// NewAuthController создание контроллера для авторизации
func NewAuthController(_ context.Context, s service, tracer trace.Tracer) *authController {
	return &authController{
		s:      s,
		tracer: tracer,
	}
}

type RegisterData struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

func (ac *authController) LoginWithEmail(c *fiber.Ctx) error {
	return c.SendString("I'm a GET request!")
}

type accessTokenResponse struct {
	AccessToken string `json:"AccessToken"`
}

type errResponse struct {
	Err string `json:"error"`
}

// CreateAccountWithEmail godoc
//
//	создание аккаунта с использованием почти как метода авторизации
//
// @Summary User login
// @Description Login with email
// @Tags auth
// @Accept  json
// @Produce  json
// @Param email body string true "User Email"
// @Param password body string true "User Password"
// @Success 200 {object} accessTokenResponse
// @Failure 400 {object} errResponse
// @Router /auth/login [post]
func (ac *authController) CreateAccountWithEmail(c *fiber.Ctx) error {
	ctx, span := ac.tracer.Start(c.Context(), "fiber.LoginWithEmail")
	defer span.End()

	var payload RegisterData
	err := c.BodyParser(&payload)

	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	accessToken, err := ac.s.CreateUserEmail(ctx, models.UserCreate{
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
	}, payload.Email, payload.Password, c.IP())

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(accessTokenResponse{AccessToken: accessToken})
}

type EmailCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthWithEmail авторизация с использованием почты
func (ac *authController) AuthWithEmail(c *fiber.Ctx) error {
	ctx, span := ac.tracer.Start(c.Context(), "fiber.AuthWithEmail")
	defer span.End()

	var credentials EmailCredentials
	if err := c.BodyParser(&credentials); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	accessToken, err := ac.s.AuthorizeEmail(ctx, credentials.Email, credentials.Password, c.IP())
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"accessToken": accessToken})
}

func (ac *authController) GetUserData(c *fiber.Ctx) error {
	_, span := ac.tracer.Start(c.Context(), "fiber.GetUserData")
	defer span.End()

	user := c.Locals("userClaims").(*jwt.Token)
	//slog.Info("usertoken", user.Raw)

	claims := user.Claims.(*token.UserClaims)

	//if err != nil {
	//	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": err.Error()})
	//}
	return c.JSON(claims.UserPayload)
}

func (ac *authController) AuthWithVk(c *fiber.Ctx) error {
	ctx, span := ac.tracer.Start(c.Context(), "fiber.GetUserData")
	defer span.End()

	accessCode := c.Query("code")

	url, err := ac.s.AuthorizeVk(ctx, accessCode)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": err.Error()})
	}

	return c.JSON(fiber.Map{"url": url})
}
