package postgres

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/EgorTarasov/true-tech/backend/internal/accounts/models"
	"github.com/EgorTarasov/true-tech/backend/internal/accounts/repository"
	"github.com/EgorTarasov/true-tech/backend/pkg/db"
	"go.opentelemetry.io/otel/trace"
)

type paymentAccountRepo struct {
	pg     *db.Database
	tracer trace.Tracer
}

// NewPaymentAccountRepo создание репозитория для платежных аккаунтов
func NewPaymentAccountRepo(pg *db.Database, tracer trace.Tracer) *paymentAccountRepo {
	return &paymentAccountRepo{
		pg:     pg,
		tracer: tracer,
	}
}

// Create создание платежного аккаунта
func (pa *paymentAccountRepo) Create(ctx context.Context, userId int64, name string, cardInfo models.CardInfo) (int64, error) {
	ctx, span := pa.tracer.Start(ctx, "paymentAccountRepo.Create")
	defer span.End()
	var newId int64

	query := `insert into payment_accounts(name, card_number, expiration_date, cvc) VALUES ($1, $2, $3, $4) returning id;`

	if err := pa.pg.Get(ctx, &newId, query, name, cardInfo.Number, cardInfo.ExpirationDate, cardInfo.CVC); err != nil {
		return newId, fmt.Errorf("repo err: %v", err)
	}
	query = `insert into users_accounts(user_id, account_id) VALUES ($1, $2)`
	if _, err := pa.pg.Exec(ctx, query, userId, newId); err != nil {
		return newId, fmt.Errorf("repo err: %v", err)
	}
	return newId, nil
}

// CreateWithOutUser создание платежного аккаунта для неавторизованных пользователей
func (pa *paymentAccountRepo) CreateWithOutUser(ctx context.Context, cardInfo models.CardInfo) (int64, error) {
	ctx, span := pa.tracer.Start(ctx, "paymentAccountRepo.Create")
	defer span.End()
	var newId int64

	query := `insert into payment_accounts(card_number, expiration_date, cvc) VALUES ($1, $2, $3) returning id;`
	if err := pa.pg.Get(ctx, &newId, query, cardInfo.Number, cardInfo.ExpirationDate, cardInfo.CVC); err != nil {
		return newId, fmt.Errorf("repo err: %v", err)
	}
	return newId, nil
}

// Replenishment пополнение с аккаунта
func (pa *paymentAccountRepo) Replenishment(ctx context.Context, accountId int64, amount int64, metadata map[string]any) (int64, error) {
	ctx, span := pa.tracer.Start(ctx, "paymentAccountRepo.Replenishment")
	defer span.End()

	query := `update payment_accounts pa set frozen = frozen + $1 where pa.id = $1 and pa.deleted_at is null;`
	if _, err := pa.pg.Exec(ctx, query, amount, accountId); err != nil {
		return 0, err
	}

	//	create transaction
	var transactionId int64
	query = `insert into transactions(account_id, amount, operation, status, metadata) values ($1, $2, $3::transaction_operation, $4::transaction_status, $5::json) returning id`
	rawJson, err := json.Marshal(metadata)
	if err != nil {
		return 0, fmt.Errorf("invalid json format: %v", err)
	}

	if err := pa.pg.Select(ctx, &transactionId, query, accountId, amount, models.Invoice, models.Created, string(rawJson)); err != nil {
		return transactionId, fmt.Errorf("repo err: %v", err)
	}
	return transactionId, nil
}

// FinishReplenishment Transaction
func (pa *paymentAccountRepo) FinishReplenishment(ctx context.Context, transactionId int64) error {
	ctx, span := pa.tracer.Start(ctx, "paymentAccountRepo.ReplenishmentWithCardInfo")
	defer span.End()
	//update transactions set status = 'success'::transaction_status where transactions.id = 1;
	//update payment_accounts pa set frozen = 0 where pa.id = 99999;
	// prepares accountId
	var (
		amount    int64
		accountId int64
	)
	query := `update transactions set status = $1::transaction_status where transactions.id = $2 returning account_id, amount;`
	row := pa.pg.ExecQueryRow(ctx, query, models.Success, transactionId)
	if err := row.Scan(&accountId, &amount); err != nil {
		return fmt.Errorf("err FinishEnvoke: %v", err)
	}

	//	update accountId

	query = `update payment_accounts pa set balance = balance + $1, frozen = frozen - $1  where pa.deleted_at is null and pa.id = $2`
	if _, err := pa.pg.Exec(ctx, query, amount, accountId); err != nil {
		return fmt.Errorf("repo err: %v", err)
	}

	return nil
}

// WithDraw (int)
// снятие денег со счета
func (pa *paymentAccountRepo) WithDraw(ctx context.Context, accountId int64, amount int64, metadata map[string]any) (int64, error) {
	ctx, span := pa.tracer.Start(ctx, "paymentAccountRepo.WithDraw")
	defer span.End()

	// prepares account
	query := `update payment_accounts pa set frozen = frozen + $1, balance = balance - $1 where pa.id = $2 and pa.deleted_at is null;`
	if _, err := pa.pg.Exec(ctx, query, amount, accountId); err != nil {
		return 0, err
	}

	//	create transaction
	var transactionId int64
	rawJson, err := json.Marshal(metadata)
	if err != nil {
		return 0, fmt.Errorf("invalid json format: %v", err)
	}
	query = `insert into transactions(account_id, amount, operation, status, metadata) values ($1, $2, $3::transaction_operation, $4::transaction_status, $5::json) returning id;`
	if err := pa.pg.Get(ctx, &transactionId, query, accountId, amount, models.WithDraw, models.Created, string(rawJson)); err != nil {
		return transactionId, fmt.Errorf("repo err: %v", err)
	}

	return transactionId, nil
}

// FinishWithDraw Transaction
func (pa *paymentAccountRepo) FinishWithDraw(ctx context.Context, transactionId int64) error {
	ctx, span := pa.tracer.Start(ctx, "paymentAccountRepo.FinishWithDraw")
	defer span.End()

	var (
		amount    int64
		accountId int64
	)
	query := `update transactions set status = $1::transaction_status where transactions.id = $2 returning account_id, amount;`
	row := pa.pg.ExecQueryRow(ctx, query, models.Success, transactionId)
	if err := row.Scan(&accountId, &amount); err != nil {
		return fmt.Errorf("err FinishEnvoke: %v", err)
	}

	//	update accountId

	query = `update payment_accounts pa set frozen = frozen - $1  where pa.deleted_at is null and pa.id = $2`
	if _, err := pa.pg.Exec(ctx, query, amount, accountId); err != nil {
		return fmt.Errorf("repo err: %v", err)
	}

	return nil
}

// Delete

func (pa *paymentAccountRepo) GetAccounts(ctx context.Context, userId int64) ([]models.PaymentAccountDao, error) {
	ctx, span := pa.tracer.Start(ctx, "paymentAccountRepo.FinishWithDraw")
	defer span.End()

	var accounts []models.PaymentAccountDao

	query := `
select
    pa.id,
    ua.user_id,
    pa.name,
    pa.balance,
    pa.frozen,
    pa.created_at,
    pa.updated_at
from 
    payment_accounts pa 
join users_accounts ua 
    on pa.id = ua.account_id 
where	 pa.deleted_at is null and ua.user_id = $1;
`
	if err := pa.pg.Select(ctx, &accounts, query, userId); err != nil {
		return nil, fmt.Errorf("error during GetAccounts: %v", err)
	}
	return accounts, nil
}

func (pa *paymentAccountRepo) GetAccount(ctx context.Context, cardInfo models.CardInfo) (int64, error) {
	ctx, span := pa.tracer.Start(ctx, "paymentAccountRepo.GetAccount")
	defer span.End()

	var accountId int64

	query := `select pa.id from payment_accounts pa where card_number = $1 and deleted_at is null and cvc = $2 and expiration_date = $3;`
	if err := pa.pg.Get(ctx, &accountId, query, cardInfo.Number, cardInfo.CVC, cardInfo.ExpirationDate); err != nil {
		return accountId, repository.ErrAccountNotFound
	}
	return accountId, nil
}
