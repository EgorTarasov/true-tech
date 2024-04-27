-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS "users"(
    id bigserial primary key,
    first_name text not null,
    last_name text not null,
    role int not null default  0,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp default null
);

CREATE TABLE IF NOT EXISTS email_auth(
    user_id  bigint references "users"(id) primary key,
    email text,
    password text,
    created_at timestamp not null default now(),
    last_used timestamp not null default now(),
    last_ip text,
    deleted_at timestamp default  null
);

CREATE TABLE IF NOT EXISTS vk_auth(
    user_id bigint references "users"(id) primary key,
    vk_id bigint unique,
    first_name text not null,
    last_name text not null,
    birth_date timestamp,
    city text,
    photo text,
    sex int,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp default  null
);


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
drop table email_auth;
drop table vk_auth;
drop table "users";
-- +goose StatementEnd
