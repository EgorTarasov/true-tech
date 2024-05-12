-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
create table if not exists detection_sessions(
    id bigserial primary key,
    uuid text unique,
    user_id bigint references "users"(id),
    created_at timestamp default now()
);

create table if not exists detection_queries(
    id bigserial primary key,
    session_id bigint references detection_sessions(id),
    content text,
    label text,
    detected_keys json,
    status int,
    created_at timestamp default now()
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
drop table detection_queries;
drop table detection_sessions;
-- +goose StatementEnd
