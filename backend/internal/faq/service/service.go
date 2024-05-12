package service

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/faq/models"
	pb "github.com/EgorTarasov/true-tech/backend/internal/stubs"
	"github.com/rs/zerolog/log"
)

type faqService struct {
	client pb.SearchEngineClient
}

func NewFaqService(client pb.SearchEngineClient) *faqService {
	return &faqService{client: client}
}

func (fs *faqService) RespondStream(ctx context.Context, query string, respCh chan<- models.MlResponse, errCh chan<- error) {
	// read from client stream and pass to

	// get stream from client
	stream, err := fs.client.RespondStream(ctx, &pb.Query{Body: query, Model: "faq"})
	if err != nil {
		errCh <- err
		return
	}

	for {
		resp, err := stream.Recv()
		if err != nil {
			errCh <- err
			return
		}
		response := models.MlResponse{
			QueryId:  0,
			Text:     resp.Body,
			Metadata: resp.Context,
			Last:     false,
			Sender:   "assistant",
		}
		if resp.Context != "" {
			response.Last = true
		}
		log.Info().Str("response", response.Text).Msg("response from faq service")
		respCh <- response
		if response.Last {
			break
		}

	}

}
