package handler

// TODO: добавить Description
import (
	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
	"github.com/gofiber/fiber/v2"
)

type HPUPaymentResponse struct {
	TransactionId int64 `json:"transactionId"`
}

// HPUPayment godoc
//
//	Оплата услуг ЖКХ
//
// @Summary Оплата услуг жкх
// @Description
// @Tags kvartplata
// @Accept  json
// @Produce  json
// @Param        account  body   models.HPUWithAccountId  true  "HPUPayment"
// @Success 200 {object} HPUPaymentResponse
// @Failure 400 {object} errResponse
// @Failure 500 {object} errResponse
// @Router /payments/kvartplata/id [post]
func (h *handler) HPUPayment(c *fiber.Ctx) error {
	ctx, span := h.tracer.Start(c.Context(), "handler.TopUpMobilePhone")
	defer span.End()

	var request models.HPUWithAccountId
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"err": err.Error()})
	}

	transactionId, err := h.s.HPUPayment(ctx, request)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(HPUPaymentResponse{
		TransactionId: transactionId,
	})
}

// HPUPaymentWithCardInfo godoc
//
//	Оплата услуг ЖКХ
//
// @Summary Оплата услуг ЖКХ с использованием данных банковской карты
// @Description
// @Tags kvartplata
// @Accept  json
// @Produce  json
// @Param        account  body   models.HPUWithCardData  true  "HPUWithCardData"
// @Success 200 {object} TopUpMobilePhoneResponse
// @Failure 400 {object} errResponse
// @Failure 500 {object} errResponse
// @Router /payments/kvartplata/card [post]
func (h *handler) HPUPaymentWithCardInfo(c *fiber.Ctx) error {
	ctx, span := h.tracer.Start(c.Context(), "handler.TopUpMobilePhone")
	defer span.End()

	var request models.PhoneRefillDataWithCardData
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"err": err.Error()})
	}

	transactionId, err := h.s.TopUpMobilePhoneUnauthorized(ctx, request)
	if err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"err": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(HPUPaymentResponse{
		TransactionId: transactionId,
	})
}
