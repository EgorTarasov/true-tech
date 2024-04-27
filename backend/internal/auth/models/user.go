package models

import (
	"time"

	"github.com/EgorTarasov/true-tech/internal/shared/constants"
)

// UserCreate данные необходимые для записи о пользователе
type UserCreate struct {
	FirstName string         `json:"firstName"`
	LastName  string         `json:"lastName"`
	avatar    string         `` // TODO: add profile pictures via s3
	Role      constants.Role `json:"role"`
}

// VkUserData данные для авторизации по вк
// используется для передачи данных от сервиса к бд
type VkUserData struct {
	UserId    int64
	VkId      int64
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	BirthDate time.Time
	City      string
	Photo     string
	Sex       constants.Sex
}

type VkUserDataDao struct {
	UserId    int64         `db:"user_id"`
	VkId      int64         `db:"vk_id"`
	FirstName string        `db:"first_name"`
	LastName  string        `db:"last_name"`
	BirthDate time.Time     `db:"birth_date"`
	City      string        `db:"city"`
	Photo     string        `db:"photo"`
	Sex       constants.Sex `db:"sex"`
	CreatedAt time.Time     `db:"created_at"`
	UpdatedAt time.Time     `db:"updated_at"`
	DeletedAt time.Time     ``
}

// UserDao представление пользователя на Data слое
type UserDao struct {
	Id        int64          `db:"id" json:"id"`
	FirstName string         `db:"first_name" json:"first_name"`
	LastName  string         `db:"last_name" json:"last_name"`
	Role      constants.Role `db:"role" json:"role"`
	CreatedAt time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt time.Time      `db:"updated_at" json:"updated_at"`
	DeletedAt time.Time      ``
}

// Dto преобразование UserDao -> UserDto
func (ud *UserDao) Dto() UserDto {
	return UserDto{
		Id:        ud.Id,
		FirstName: ud.FirstName,
		LastName:  ud.LastName,
	}
}

// UserDto модель пользователя на уровне сервиса
type UserDto struct {
	Id        int64  `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}
