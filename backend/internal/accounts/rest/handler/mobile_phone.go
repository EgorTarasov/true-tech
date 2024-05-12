package handler

import (
	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
	"github.com/gofiber/fiber/v2"
)

type TopUpMobilePhoneResponse struct {
	TransactionId int64 `json:"transactionId"`
}

// TopUpMobilePhone godoc
//
//	Оплата телефона с использованием аккаунта
//
// @Summary пополнение телефона с помощью платежного аккаунта
// @Description
// @Tags mobile
// @Accept  json
// @Produce  json
// @Param        account  body   models.PhoneRefillDataWithAccountId  true  "mobileTopUpRequest"
// @Success 200 {object} TopUpMobilePhoneResponse
// @Failure 400 {object} errResponse
// @Failure 500 {object} errResponse
// @Router /payments/mobile/id [post]
func (h *handler) TopUpMobilePhone(c *fiber.Ctx) error {
	ctx, span := h.tracer.Start(c.Context(), "handler.TopUpMobilePhone")
	defer span.End()

	var request models.PhoneRefillDataWithAccountId
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"err": err.Error()})
	}

	transactionId, err := h.s.TopUpMobilePhone(ctx, request)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(TopUpMobilePhoneResponse{
		TransactionId: transactionId,
	})
}

// TopUpMobilePhoneWithCardInfo godoc
//
//	Оплата телефона с использованием данных банковской карты
//
// @Summary Оплата телефона с использованием данных банковской карты
// @Description
// @Tags mobile
// @Accept  json
// @Produce  json
// @Param        account  body   models.PhoneRefillDataWithCardData  true  "mobileTopUpRequest"
// @Success 200 {object} TopUpMobilePhoneResponse
// @Failure 400 {object} errResponse
// @Failure 500 {object} errResponse
// @Router /payments/mobile/card [post]
func (h *handler) TopUpMobilePhoneWithCardInfo(c *fiber.Ctx) error {
	ctx, span := h.tracer.Start(c.Context(), "handler.TopUpMobilePhone")
	defer span.End()

	var request models.PhoneRefillDataWithCardData
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"err": err.Error()})
	}

	transactionId, err := h.s.TopUpMobilePhoneUnauthorized(ctx, request)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(TopUpMobilePhoneResponse{
		TransactionId: transactionId,
	})
}
