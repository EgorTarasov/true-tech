package db

import (
	"context"

	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.opentelemetry.io/otel/trace"
)

// QueryEngine интерфейс для работы с запросами к бд
type QueryEngine interface {
	Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
	Exec(ctx context.Context, sql string, arguments ...any) (pgconn.CommandTag, error)
}

// Database обертка для работы с pgxpool.Pool
type Database struct {
	pool   *pgxpool.Pool
	tracer trace.Tracer
}

// TODO: организовать работу с транзакциями

func newDatabase(cluster *pgxpool.Pool, tracer trace.Tracer) *Database {
	return &Database{pool: cluster, tracer: tracer}
}

// Get возвращает одну запись
func (db *Database) Get(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	return pgxscan.Get(ctx, db.pool, dest, query, args...)
}

// Select выполняет запрос и возвращает результат
func (db *Database) Select(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	return pgxscan.Select(ctx, db.pool, dest, query, args...)
}

// Exec выполняет запрос
func (db *Database) Exec(ctx context.Context, query string, args ...interface{}) (pgconn.CommandTag, error) {
	return db.pool.Exec(ctx, query, args...)
}

// ExecQueryRow выполняет запрос и возвращает строку
func (db *Database) ExecQueryRow(ctx context.Context, query string, args ...interface{}) pgx.Row {
	return db.pool.QueryRow(ctx, query, args...)
}
