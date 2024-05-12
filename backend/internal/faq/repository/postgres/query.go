package postgres

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/faq/models"
	"github.com/EgorTarasov/true-tech/backend/pkg/db"
	"go.opentelemetry.io/otel/trace"
)

type queryRepo struct {
	pg     *db.Database
	tracer trace.Tracer
}

func NewActionRepo(pg *db.Database, tracer trace.Tracer) *queryRepo {
	return &queryRepo{
		pg:     pg,
		tracer: tracer,
	}
}

func (qr *queryRepo) InsertOne(ctx context.Context, userQuery models.QueryCreate) (int64, error) {
	ctx, span := qr.tracer.Start(ctx, "queryRepo.InsertOne")
	defer span.End()

	query := `insert into chat(query, response) values ($1, $2) returning id;`
	var queryId int64
	if err := qr.pg.Get(ctx, &queryId, query, userQuery.Text, userQuery.Response); err != nil {
		return 0, err
	}
	return queryId, nil
}
