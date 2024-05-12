-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

create table if not exists chat (
    id serial primary key,
    query text not null,
    response text not null,
    created_at timestamp not null default now()
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
drop table if exists chat;
-- +goose StatementEnd
