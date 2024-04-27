package telemetry

import (
	"context"

	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/sdk/resource"
	oteltrace "go.opentelemetry.io/otel/sdk/trace"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.24.0"
)

// NewConsoleExporter заглушка для проверки работы трейсера
func NewConsoleExporter() (oteltrace.SpanExporter, error) {
	return stdouttrace.New()
}

// NewOTLPExporter создает экспортер трейсов в OTLP
func NewOTLPExporter(ctx context.Context, endpoint string) (oteltrace.SpanExporter, error) {

	insecureOpt := otlptracehttp.WithInsecure()

	endpointOpt := otlptracehttp.WithEndpoint(endpoint)

	return otlptracehttp.New(ctx, insecureOpt, endpointOpt)
}

// NewTraceProvider фабрика для создания провайдера трейсера
func NewTraceProvider(exp sdktrace.SpanExporter) *sdktrace.TracerProvider {
	r, err := resource.Merge(
		resource.Default(),
		resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceName("myapp"),
		),
	)

	if err != nil {
		panic(err)
	}

	return sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exp),
		sdktrace.WithResource(r),
	)
}
