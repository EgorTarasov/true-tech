package postgres

import (
	"context"

	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
	"github.com/EgorTarasov/true-tech/backend/pkg/db"
	"go.opentelemetry.io/otel/trace"
)

type formRepo struct {
	pg     *db.Database
	tracer trace.Tracer
}

// NewFormRepo создание репозитория для платежных аккаунтов
func NewFormRepo(pg *db.Database, tracer trace.Tracer) *formRepo {
	return &formRepo{
		pg:     pg,
		tracer: tracer,
	}
}

func (fr *formRepo) Create(ctx context.Context, name string, fields []int64) (int64, error) {
	ctx, span := fr.tracer.Start(ctx, "formRepo.Create")
	defer span.End()

	var formId int64
	query := `insert into custom_form(name) values ($1) returning id;`
	if err := fr.pg.Get(ctx, &formId, query, name); err != nil {
		return formId, err
	}
	for _, val := range fields {
		query = `insert into custom_form_input_fields(custom_form_id, input_fields_id) values ($1, $2);`
		if _, err := fr.pg.Exec(ctx, query, formId, val); err != nil {
			return formId, err
		}
	}

	return formId, nil
}

func (fr *formRepo) List(ctx context.Context) ([]models.FormDao, error) {
	ctx, span := fr.tracer.Start(ctx, "formRepo.List")
	defer span.End()

	var forms []models.FormDao
	query := `
SELECT
    cf.id,
    cf.name,
    json_agg(json_build_object('id', if.id, 'name', if.name, 'type', if.type, 'placeholder', if.placeholder, 'label', if.label, 'inputmode', if.inputmode, 'speelcheck', if.spellcheck)) AS fields
FROM
    custom_form cf
        JOIN
    custom_form_input_fields cfi ON cf.id = cfi.custom_form_id
        JOIN
    input_fields if ON cfi.input_fields_id = if.id
GROUP BY
    cf.id;`
	if err := fr.pg.Select(ctx, &forms, query); err != nil {
		return nil, err
	}
	return forms, nil
}

func (fr *formRepo) Fields(ctx context.Context) ([]models.InputFieldDao, error) {
	ctx, span := fr.tracer.Start(ctx, "formRepo.Fields")
	defer span.End()

	var fields []models.InputFieldDao
	query := `select id, name, type, label, placeholder, inputmode, spellcheck from input_fields;`
	if err := fr.pg.Select(ctx, &fields, query); err != nil {
		return nil, err
	}
	return fields, nil
}

func (fr *formRepo) FormFields(ctx context.Context, formId int64) ([]models.InputFieldDao, error) {
	ctx, span := fr.tracer.Start(ctx, "formRepo.FormFields")
	defer span.End()

	var fields []models.InputFieldDao
	query := `select id, name, type, label, placeholder, inputmode, spellcheck from input_fields where id in (select input_fields_id from custom_form_input_fields where custom_form_id = $1);`
	if err := fr.pg.Select(ctx, &fields, query, formId); err != nil {
		return nil, err
	}
	return fields, nil
}
