package config

import (
	"log"

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

type domainDetectionService struct {
	Host string `yaml:"host"`
	Port int    `yaml:"port"`
}

// Config для запуска приложения
type Config struct {
	Server        *server                 `yaml:"http-server"`
	Telemetry     *telemetry.Config       `yaml:"telemetry"`
	Database      *db.Config              `yaml:"postgres"`
	Redis         *redis.Config           `yaml:"redis"`
	VkAuth        *vkAuth                 `yaml:"vk-auth"`
	DomainService *domainDetectionService `yaml:"domain-service"`
}

// MustNew создает новый конфиг из файла и завершает программу в случае ошибки
func MustNew(path string) *Config {
	cfg := &Config{}
	if err := cleanenv.ReadConfig(path, cfg); err != nil {
		log.Fatal(err)
	}
	return cfg
}
