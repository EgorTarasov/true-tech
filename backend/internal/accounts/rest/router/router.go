package router

import (
	"github.com/EgorTarasov/true-tech/backend/internal/auth/rest/middleware"
	"github.com/gofiber/fiber/v2"
)

import (
	"context"
)

// TODO: split interface

type handler interface {
	CreatePaymentAccount(c *fiber.Ctx) error
	GetAccountsInfo(c *fiber.Ctx) error
	TopUpMobilePhone(c *fiber.Ctx) error
	TopUpMobilePhoneWithCardInfo(c *fiber.Ctx) error
	HPUPayment(c *fiber.Ctx) error
	HPUPaymentWithCardInfo(c *fiber.Ctx) error
	CreateCustomForm(c *fiber.Ctx) error
	ListForms(c *fiber.Ctx) error
	ListFields(c *fiber.Ctx) error
}

func InitAccountsRouter(_ context.Context, app *fiber.App, accountsHandler handler) error {

	accounts := app.Group("/accounts")

	accounts.Post("/create", middleware.UserClaimsMiddleware, accountsHandler.CreatePaymentAccount)
	accounts.Get("/my", middleware.UserClaimsMiddleware, accountsHandler.GetAccountsInfo)
	//accounts.Get("/transactions/:id")

	payments := app.Group("/payments")

	mobilePhone := payments.Group("/mobile")

	mobilePhone.Post("/id", middleware.UserClaimsMiddleware, accountsHandler.TopUpMobilePhone)
	mobilePhone.Post("/card", accountsHandler.TopUpMobilePhoneWithCardInfo)

	kvartplata := payments.Group("/kvartplata")

	kvartplata.Post("/id", middleware.UserClaimsMiddleware, accountsHandler.HPUPayment)
	kvartplata.Post("/card", accountsHandler.HPUPaymentWithCardInfo)

	forms := app.Group("/form")

	forms.Post("/create", middleware.UserClaimsMiddleware, accountsHandler.CreateCustomForm)
	forms.Get("/list", accountsHandler.ListForms)
	forms.Get("/fields", accountsHandler.ListFields)
	return nil
}
