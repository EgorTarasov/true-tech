package models

import (
	"time"
)

type TransactionStatus string

const (
	Created TransactionStatus = "created"
	Success TransactionStatus = "success"
	Error   TransactionStatus = "error"
)

type TransactionOperation string

const (
	Invoice  TransactionOperation = "invoice"
	WithDraw TransactionOperation = "withdraw"
)

type Transaction struct {
	Id        int64                `db:"id"`
	AccountId int64                `db:"account_id"`
	Amount    int64                `db:"amount"`
	Metadata  map[string]any       `db:"metadata"`
	Operation TransactionOperation `db:"operation"`
	Status    TransactionStatus    `db:"status"`
	CreatedAt time.Time            `db:"created_at"`
}

//
//create type transaction_status as ENUM(
//'success',
//'created',
//'error'
//);
//
//create type transaction_operation as ENUM(
//'invoice',
//'withdraw'
//);
//
//
//create table if not exists transactions(
//id bigserial primary key,
//account_id bigint references payment_accounts(id),
//amount bigint not null,
//metadata json not null default '{}'::json,
//operation transaction_operation not null,
//status transaction_status not null default 'created',
//created_at timestamp default now()
//);
