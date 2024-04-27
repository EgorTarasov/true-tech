package service

import (
	"context"

	pb "github.com/EgorTarasov/true-tech/backend/internal/gen"
)

type service struct {
	speechService pb.SpeechServiceClient
}

func New(_ context.Context, speechService pb.SpeechServiceClient) *service {
	return &service{
		speechService: speechService,
	}
}

// Detect тестовый метод для тестирования gprc
func (s *service) Detect(ctx context.Context, audio []byte) (string, error) {
	req := &pb.SpeechToTextRequest{
		Audio: audio,
	}
	resp, err := s.speechService.SpeechToText(ctx, req)
	if err != nil {
		return "", err
	}
	return resp.Text, nil
}
