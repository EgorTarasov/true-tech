package service

import (
	"context"
	"strings"

	"github.com/EgorTarasov/true-tech/backend/internal/faq/models"
	pb "github.com/EgorTarasov/true-tech/backend/internal/stubs"
	"github.com/rs/zerolog/log"
)

type queryRepo interface {
	InsertOne(ctx context.Context, userQuery models.QueryCreate) (int64, error)
}

type faqService struct {
	repo   queryRepo
	client pb.SearchEngineClient
}

func NewFaqService(repo queryRepo, client pb.SearchEngineClient) *faqService {
	return &faqService{
		repo:   repo,
		client: client}
}

func (fs *faqService) RespondStream(ctx context.Context, query string, respCh chan<- models.MlResponse, errCh chan<- error) {
	// read from client stream and pass to

	// get stream from client
	stream, err := fs.client.RespondStream(ctx, &pb.Query{Body: query, Model: "faq"})
	if err != nil {
		errCh <- err
		return
	}
	modelResponse := strings.Builder{}
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
		modelResponse.WriteString(resp.Body)
		if resp.Context != "" {
			response.Last = true
			_, err := fs.repo.InsertOne(ctx, models.QueryCreate{Text: query, Response: modelResponse.String()})
			if err != nil {
				log.Error().Err(err).Msg("error while inserting query")
				errCh <- err
			}
			modelResponse.Reset()
		}
		log.Info().Str("response", response.Text).Msg("response from faq service")
		respCh <- response
		if response.Last {
			break
		}

	}

}
