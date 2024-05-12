package router

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

type faqHandler interface {
	RespondStream(c *websocket.Conn)
}

func InitFaqRouter(app *fiber.App, controller faqHandler) error {

	faq := app.Group("/faq")
	faq.Use("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	faq.Get("/ws", websocket.New(controller.RespondStream))
	return nil
}
