-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
create table if not exists web_auth (
    id bigserial primary key,
    name text,
    display_name text,
    icon text,
    credentials json
);


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
drop table web_auth;
-- +goose StatementEnd
