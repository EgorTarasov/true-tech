package client

import (
	"fmt"

	pb "github.com/EgorTarasov/true-tech/backend/internal/stubs"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type Config struct {
	Host string
	Port int
}

func New(cfg *Config) pb.SearchEngineClient {
	var grpcOpts []grpc.DialOption
	grpcOpts = append(grpcOpts, grpc.WithTransportCredentials(insecure.NewCredentials()))
	conn, err := grpc.Dial(fmt.Sprintf("%s:%d", cfg.Host, cfg.Port), grpcOpts...)
	if err != nil {
		panic(err)
	}
	client := pb.NewSearchEngineClient(conn)
	return client
}
