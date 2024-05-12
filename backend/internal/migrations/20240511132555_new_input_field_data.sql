-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
alter table input_fields add column label text not null default '';
alter table input_fields add column placeholder text not null default '';
alter table input_fields add column inputmode text not null default '';
alter table input_fields add column spellcheck boolean not null default false;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
alter table input_fields drop column label;
alter table input_fields drop column placeholder;
alter table input_fields drop column inputmode;
alter table input_fields drop column spellcheck;
-- +goose StatementEnd
