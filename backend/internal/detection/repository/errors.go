package repository

import (
	"errors"
)

var (
	ErrSessionAlreadyExists = errors.New("session already exists")
)
