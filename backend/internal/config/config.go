package config

import (
	"fmt"
	"log"

	"github.com/EgorTarasov/true-tech/backend/internal/detection/service/domain_client"
	faqClient "github.com/EgorTarasov/true-tech/backend/internal/faq/service/client"
	"github.com/EgorTarasov/true-tech/backend/pkg/db"
	"github.com/EgorTarasov/true-tech/backend/pkg/redis"
	"github.com/EgorTarasov/true-tech/backend/pkg/telemetry"
	"github.com/ilyakaznacheev/cleanenv"
)

// TODO: add comments
type server struct {
	Port        int      `yaml:"port"`
	Domain      string   `yaml:"domain"`
	CorsOrigins []string `yaml:"cors-origins"`
}

// TODO: add comments
type vkAuth struct {
	VkTokenUrl     string `yaml:"vk-token-url"`
	VkClientId     string `yaml:"vk-client-id"`
	VkSecureToken  string `yaml:"vk-secure-token"`
	VkServiceToken string `yaml:"vk_service_token"`
	VkRedirectUri  string `yaml:"vk-redirect-uri"`
}

// Config для запуска приложения
type Config struct {
	Server        *server               `yaml:"http-server"`
	Telemetry     *telemetry.Config     `yaml:"telemetry"`
	Database      *db.Config            `yaml:"postgres"`
	Redis         *redis.Config         `yaml:"redis"`
	VkAuth        *vkAuth               `yaml:"vk-auth"`
	DomainService *domain_client.Config `yaml:"domain"`
	FaqService    *faqClient.Config     `yaml:"faq"`
}

// MustNew создает новый конфиг из файла и завершает программу в случае ошибки
func MustNew(path string, dockerMode bool) *Config {
	cfg := &Config{}
	if err := cleanenv.ReadConfig(path, cfg); err != nil {
		log.Fatal(err)
	}

	if dockerMode {
		cfg.Telemetry.OTLPEndpoint = "jaeger:4318"
		cfg.Redis.Host = "redis"
		cfg.Database.Host = "database"

		for i, _ := range cfg.DomainService.Servers {
			cfg.DomainService.Servers[i].Host = fmt.Sprintf("domain-%d", i+1)
			cfg.DomainService.Servers[i].Port = 10002
		}
		cfg.FaqService.Host = "faq"
	}

	return cfg
}
