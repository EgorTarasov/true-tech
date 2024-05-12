package metrics

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// RunPrometheus запуск метрик приложения
func RunPrometheus(ctx context.Context, port int) {
	// TODO: create init method for custom metrics
	
	metricServer := http.Server{
		Addr:              fmt.Sprintf("0.0.0.0:%d", port),
		WriteTimeout:      30 * time.Second,
		ReadHeaderTimeout: 30 * time.Second,
		Handler:           promhttp.Handler(),
	}
	if err := metricServer.ListenAndServe(); err != nil {
		log.Fatalf("failed to start prometheus: %v", err.Error())
	}
}
