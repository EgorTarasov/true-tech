package models

import (
	"time"
)

// PaymentAccountDao сохранение баланса пользователя
type PaymentAccountDao struct {
	Id        int64     `db:"id"`
	UserId    int64     `db:"user_id"`
	Name      string    `db:"name"`
	Balance   int64     `db:"balance"`
	Frozen    int64     `db:"frozen"`
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

func Dto(dao *PaymentAccountDao) PaymentAccountDto {
	return PaymentAccountDto{
		Id:      dao.Id,
		Name:    dao.Name,
		Balance: dao.Balance,
	}
}

type PaymentAccountDto struct {
	Id      int64  `db:"id"`
	Name    string `db:"name"`
	Balance int64  `db:"balance"`
}
