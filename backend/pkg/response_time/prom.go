package response_time

import (
	"github.com/prometheus/client_golang/prometheus"
)

var (
	responseTimeGauge = prometheus.NewGauge(prometheus.GaugeOpts{
		Namespace:   "api",
		Subsystem:   "http",
		Name:        "api_response_time",
		Help:        "",
		ConstLabels: nil,
	},
	)
)
