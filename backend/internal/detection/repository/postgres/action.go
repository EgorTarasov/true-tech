package postgres

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/detection/models"
	"github.com/EgorTarasov/true-tech/backend/pkg/db"
	"github.com/rs/zerolog/log"
	"go.opentelemetry.io/otel/trace"
)

type actionsRepo struct {
	pg     *db.Database
	tracer trace.Tracer
}

// NewActionRepo репозиторий для работы с действиями мтс банка
func NewActionRepo(pg *db.Database, tracer trace.Tracer) *actionsRepo {
	return &actionsRepo{
		pg:     pg,
		tracer: tracer,
	}
}

// SavePageInfo сохранение информации о доступных действиях на странице
func (ac *actionsRepo) SavePageInfo(ctx context.Context, page models.PageCreate, actions []models.InputField) (int64, error) {
	ctx, span := ac.tracer.Start(ctx, "actionRepo.SavePageInfo")
	defer span.End()

	var pageId int64
	query := `insert into mtsbank_page_data(html, url) values ($1, $2) returning id;`
	if err := ac.pg.Get(ctx, &pageId, query, page.Html, page.Url); err != nil {
		return 0, err
	}

	var actionId int64
	for _, action := range actions {
		// insert action and make link with a page
		query = `insert into input_fields(name, type, label, placeholder, inputmode, spellcheck) values ($1, $2, $3, $4, $5, $6) returning id;`
		if err := ac.pg.Get(ctx, &actionId, query, action.Name, action.Type, action.Label, action.PlaceHolder, action.InputMode, action.SpellCheck); err != nil {
			log.Info().Msgf("error: %v", err)
			continue
		}
		query = `insert into mtsbank_page_data_input_fields(mtsbank_page_data_id, input_fields_id) values ($1, $2);`
		if _, err := ac.pg.Exec(ctx, query, pageId, actionId); err != nil {
			return 0, err
		}
	}

	return pageId, nil
}

func (ac *actionsRepo) GetPageInfo(ctx context.Context, url string) (models.PageDto, error) {
	ctx, span := ac.tracer.Start(ctx, "actionRepo.GetPageInfo")
	defer span.End()

	query := `select mpd.id, mpd.html, mpd.url, array_agg(if.id) as actions
	from mtsbank_page_data mpd
	join mtsbank_page_data_input_fields mpdif on mpd.id = mpdif.mtsbank_page_data_id
	join input_fields if on mpdif.input_fields_id = if.id
	where mpd.url = $1
	group by mpd.id, mpd.html, mpd.url;`
	var page models.PageDto
	if err := ac.pg.Get(ctx, &page, query, url); err != nil {
		return models.PageDto{}, err
	}

	return page, nil
}
