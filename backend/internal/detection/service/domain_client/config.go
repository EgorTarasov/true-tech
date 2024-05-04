package domain_client

type domainDetectionService struct {
	Host string `yaml:"host"`
	Port int    `yaml:"port"`
}

type Config struct {
	Servers []domainDetectionService `yaml:"servers"`
}
