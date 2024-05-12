package handler

import (
	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
	"github.com/gofiber/fiber/v2"
)

type createFormRequest struct {
	Name   string  `json:"name"`
	Fields []int64 `json:"fields"`
}

// CreateCustomForm godoc
//
//	создание формы для оплаты услуги
//
// @Summary создание формы для оплаты услуги
// @Description создание формы для оплаты услуги
// @Tags payments
// @Accept  json
// @Produce  json
// @Param        account  body   createFormRequest  true  "Create payment form"
// @Success 201
// @Failure 400 {object} errResponse
// @Failure 500 {object} errResponse
// @Router /form/create [post]
func (h *handler) CreateCustomForm(c *fiber.Ctx) error {
	ctx, span := h.tracer.Start(c.Context(), "handler.CreateCustomForm")
	defer span.End()

	var request createFormRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"err": err.Error()})
	}
	if _, err := h.s.CreateCustomPayment(ctx, request.Name, request.Fields); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err.Error()})
	}

	c.Status(fiber.StatusCreated)
	return nil
}

type getFormsResponse struct {
	Forms []models.FormDto `json:"forms"`
}

// ListForms godoc
//
//	получение списка форм для оплаты услуг
//
// @Summary получение списка форм для оплаты услуг
// @Description получение списка форм для оплаты услуг
// @Tags payments
// @Produce  json
// @Success 200 {object} getFormsResponse
// @Failure 400 {object} errResponse
// @Failure 500 {object} errResponse
// @Router /form/list [get]
func (h *handler) ListForms(c *fiber.Ctx) error {
	ctx, span := h.tracer.Start(c.Context(), "handler.ListForms")
	defer span.End()

	forms, err := h.s.ListCustomPayments(ctx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err.Error()})
	}

	return c.JSON(getFormsResponse{Forms: forms})
}

type getFieldsResponse struct {
	Fields []models.InputFieldDto `json:"fields"`
}

// ListFields godoc
//
//	получение списка доступных полей для формы
//
// @Summary получение списка доступных полей для формы
// @Description получение списка доступных полей для формы
// @Tags payments
// @Produce  json
// @Success 200 {object} getFieldsResponse
// @Failure 400 {object} errResponse
// @Failure 500 {object} errResponse
// @Router /form/fields [get]
func (h *handler) ListFields(c *fiber.Ctx) error {
	ctx, span := h.tracer.Start(c.Context(), "handler.ListFields")
	defer span.End()

	fields, err := h.s.ListAvailableFields(ctx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err.Error()})
	}

	return c.JSON(getFieldsResponse{Fields: fields})
}
