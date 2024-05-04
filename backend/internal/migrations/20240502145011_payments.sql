-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- создание данных пользователя для создания моков с картами

create table if not exists payment_accounts(
    id bigserial primary key,
    name text,
    card_number int,
    expiration_date text,
    cvc int,
    balance bigint not null default  0,
    frozen bigint not null default 0,
    created_at timestamp default now(),
    updated_at timestamp default now(),
    deleted_at timestamp default null
);


create table if not exists users_accounts(
    user_id bigint references "users"(id),
    account_id bigint references payment_accounts(id) unique
);

create type transaction_status as ENUM(
    'success',
    'created',
    'error'
);

create type transaction_operation as ENUM(
    'invoice',
    'withdraw'
);


create table if not exists transactions(
    id bigserial primary key,
    account_id bigint references payment_accounts(id),
    amount bigint not null,
    metadata json not null default '{}'::json,
    operation transaction_operation not null,
    status transaction_status not null default 'created',
    created_at timestamp default now(),
    updated_at timestamp default now()
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
drop table transactions;
drop type transaction_operation;
drop type transaction_status;
drop table users_accounts;
drop table payment_accounts;

-- +goose StatementEnd
