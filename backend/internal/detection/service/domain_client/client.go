package domain_client

import (
	"context"
	"fmt"
	"log/slog"
	"sync"

	pb "github.com/EgorTarasov/true-tech/backend/internal/stubs"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type grpcServer struct {
	client pb.DomainDetectionServiceClient
}

// domainClient реализует подключение к нескольким сервисам grpc
// позволяет распределять нагрузку между несколькими instance domain-service
type domainClient struct {
	cfg           *Config
	servers       []grpcServer
	mu            sync.Mutex
	currentServer int
}

func New(cfg *Config) *domainClient {
	servers := make([]grpcServer, len(cfg.Servers))
	var grpcOpts []grpc.DialOption
	grpcOpts = append(grpcOpts, grpc.WithTransportCredentials(insecure.NewCredentials()))
	for i, server := range cfg.Servers {
		conn, err := grpc.Dial(fmt.Sprintf("%s:%d", server.Host, server.Port), grpcOpts...)
		if err != nil {
			panic(fmt.Sprintf("err in init with %v %v", server, err))
		}
		client := pb.NewDomainDetectionServiceClient(conn)

		servers[i] = grpcServer{
			client: client,
		}
	}
	return &domainClient{
		cfg:           cfg,
		servers:       servers,
		currentServer: 0,
	}
}

func (dc *domainClient) DetectDomain(ctx context.Context, in *pb.DomainDetectionRequest, opts ...grpc.CallOption) (*pb.DomainDetectionResponse, error) {
	dc.mu.Lock()
	server := dc.servers[dc.currentServer]
	dc.currentServer = (dc.currentServer + 1) % len(dc.servers)
	slog.Debug("current grpc server: ", "serverId", dc.currentServer)
	dc.mu.Unlock()
	return server.client.DetectDomain(ctx, in, opts...)
}

func (dc *domainClient) ExtractLabels(ctx context.Context, in *pb.LabelDetectionRequest, opts ...grpc.CallOption) (*pb.LabelDetectionResponse, error) {
	dc.mu.Lock()
	server := dc.servers[dc.currentServer]
	dc.currentServer = (dc.currentServer + 1) % len(dc.servers)
	slog.Debug("current grpc server: ", "serverId", dc.currentServer)
	dc.mu.Unlock()
	return server.client.ExtractLabels(ctx, in, opts...)
}

func (dc *domainClient) ExtractFormData(ctx context.Context, in *pb.ExtractFormDataRequest, opts ...grpc.CallOption) (*pb.ExtractFormDataResponse, error) {
	dc.mu.Lock()
	server := dc.servers[dc.currentServer]
	dc.currentServer = (dc.currentServer + 1) % len(dc.servers)
	slog.Debug("current grpc server: ", "serverId", dc.currentServer)
	dc.mu.Unlock()
	return server.client.ExtractFormData(ctx, in, opts...)
}
