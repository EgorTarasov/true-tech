package handler

import (
	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
	"github.com/EgorTarasov/true-tech/backend/internal/auth/token"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type createAccountRequest struct {
	Name     string          `json:"name"`
	CardInfo models.CardInfo `json:"cardInfo"`
}

// CreatePaymentAccount godoc
//
//	создание платежного аккаунта для проведения моковых операций
//
// @Summary создание платежного аккаунта с использованием банковских карт
// @Description создание тестового счета для проведения операций
// @Tags account
// @Accept  json
// @Produce  json
// @Param        account  body   createAccountRequest  true  "Create account"
// @Success 201
// @Failure 400 {object} errResponse
// @Failure 500 {object} errResponse
// @Router /accounts/create [post]
func (h *handler) CreatePaymentAccount(c *fiber.Ctx) error {
	ctx, span := h.tracer.Start(c.Context(), "handler.CreatePaymentAccount")
	defer span.End()

	// получение данных пользователя из jwt response_time
	user := c.Locals("userClaims").(*jwt.Token)

	claims := user.Claims.(*token.UserClaims)

	var request createAccountRequest

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"err": err.Error()})
	}
	if err := h.s.CreateAccount(ctx, claims.UserId, request.Name, request.CardInfo); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err.Error()})
	}

	c.Status(fiber.StatusCreated)
	return nil
}

type getAccountsResponse struct {
	Accounts []models.PaymentAccountDto `json:"accounts"`
}

// GetAccountsInfo godoc
//
//	Получение информации о счетах пользователя
//
// @Summary
// @Description
// @Tags account
// @Accept  json
// @Produce  json
// @Param        account  body   createAccountRequest  true  "Create account"
// @Success 200 {object} getAccountsResponse
// @Failure 400 {object} errResponse
// @Failure 500 {object} errResponse
// @Router /accounts/my [get]
func (h *handler) GetAccountsInfo(c *fiber.Ctx) error {
	ctx, span := h.tracer.Start(c.Context(), "handler.CreatePaymentAccount")
	defer span.End()

	// получение данных пользователя из jwt response_time
	user := c.Locals("userClaims").(*jwt.Token)

	claims := user.Claims.(*token.UserClaims)

	accounts, err := h.s.GetAccounts(ctx, claims.UserId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(getAccountsResponse{Accounts: accounts})
}
