package response_time

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/prometheus/client_golang/prometheus"
)

func New() fiber.Handler {
	prometheus.MustRegister(responseTimeGauge)
	return func(c *fiber.Ctx) error {
		start := time.Now()

		err := c.Next()

		responseTimeGauge.Add(float64(time.Since(start)))
		return err

	}
}
