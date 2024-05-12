package postgres

import (
	"context"
	"errors"
	"log/slog"

	"github.com/EgorTarasov/true-tech/backend/internal/detection/models"
	"github.com/EgorTarasov/true-tech/backend/internal/detection/repository"
	"github.com/EgorTarasov/true-tech/backend/pkg/db"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
	"go.opentelemetry.io/otel/trace"
)

type detectionRepo struct {
	pg     *db.Database
	tracer trace.Tracer
}

// NewDetectionRepo репозиторий для работы с запросами пользователей
func NewDetectionRepo(pg *db.Database, tracer trace.Tracer) *detectionRepo {
	return &detectionRepo{
		pg:     pg,
		tracer: tracer,
	}
}

// CreateSession создание новой сессии с запросами
func (dr *detectionRepo) CreateSession(ctx context.Context, sessionId uuid.UUID, userId int64) (int64, error) {
	ctx, span := dr.tracer.Start(ctx, "detectionRepo.CreateSession")
	defer span.End()

	query := `insert into detection_sessions(uuid, user_id) values ($1, $2) returning id;`
	var newSessionId int64
	if err := dr.pg.Get(ctx, &newSessionId, query, sessionId, userId); err != nil {

		var (
			pgErr *pgconn.PgError
		)
		if errors.As(err, &pgErr) {
			slog.Debug(pgErr.Code, pgErr.Error())
			switch pgErr.Code {
			case "23505":
				return 0, repository.ErrSessionAlreadyExists
			}
		}
		return 0, err
	}
	return newSessionId, nil
}

// CreateQuery создание нового запроса пользователя
func (dr *detectionRepo) CreateQuery(ctx context.Context, userQuery models.DetectionQueryCreate) (int64, error) {
	ctx, span := dr.tracer.Start(ctx, "detectionRepo.CreateQuery")
	defer span.End()

	query := `insert into detection_queries(session_id, content, label, detected_keys, status)
values($1, $2, $3, $4, $5) returning id;`

	var newQueryId int64

	err := dr.pg.Get(ctx, &newQueryId, query, userQuery.SessionId, userQuery.Content, userQuery.Label, userQuery.DetectedKeys, userQuery.Status)
	if err != nil {
		return 0, err
	}
	return newQueryId, nil
}

// GetLastQueryContent получение последнего текста запроса
// TODO: возможно последние можно хранить по ключ: значение в кэше
// returns sessionId, queryContent
func (dr *detectionRepo) GetLastQueryContent(ctx context.Context, sessionUUID uuid.UUID) (int64, string, error) {
	ctx, span := dr.tracer.Start(ctx, "detectionRepo.CreateQuery")
	defer span.End()

	//query := `select q.content from detection_queries q where session_id = (select id from detection_sessions where uuid = $1) order by created_at desc limit 1;`
	query := `select s.id, q.content from detection_sessions s join detection_queries q on q.session_id = s.id where s.uuid = $1 order by q.created_at desc limit 1;`
	var (
		lastQueryContent string
		sessionId        int64
	)
	row := dr.pg.ExecQueryRow(ctx, query, sessionUUID.String())
	slog.Debug("repo", "row", row)

	err := row.Scan(&sessionId, &lastQueryContent)
	slog.Debug("repo", "sessionId", sessionId, "last q ", lastQueryContent)
	if err != nil {
		return 0, "", err
	}

	return sessionId, lastQueryContent, nil
}

// GetSession  получение истории запросов в контексте сессии
func (dr *detectionRepo) GetSession(ctx context.Context, sessionUUID uuid.UUID) (models.DetectionSessionDao, []models.DetectionQueryDao, error) {
	//ctx, span
	//
	//var (
	//	session models.DetectionSessionDao
	//	queries []models.DetectionQueryDao
	//)
	panic("not implemented")

}
