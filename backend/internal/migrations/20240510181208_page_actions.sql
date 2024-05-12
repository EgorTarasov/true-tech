-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

create table if not exists mtsbank_page_data(
    id bigserial primary key,
    html text not null,
    url text not null,
    created_at timestamp not null default now()
);

create table if not exists input_fields(
    id bigserial primary key,
    name text not null unique,
    type text not null
);

create table if not exists mtsbank_page_data_input_fields(
    id bigserial primary key,
    mtsbank_page_data_id bigint not null,
    input_fields_id bigint not null,
    created_at timestamp not null default now()
);


create table if not exists custom_form(
    id bigserial primary key,
    name text not null unique,
    created_at timestamp not null default now()
);

create table if not exists custom_form_input_fields(
    id bigserial primary key,
    custom_form_id bigint not null,
    input_fields_id bigint not null,
    created_at timestamp not null default now()
);


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
drop table if exists mtsbank_page_data_input_fields;
drop table if exists custom_form_input_fields;
drop table if exists input_fields;
drop table if exists custom_form;
drop table if exists mtsbank_page_data;

-- +goose StatementEnd
