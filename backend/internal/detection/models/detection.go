package models

import (
	"time"

	"github.com/google/uuid"
)

// TODO: move into shared constants

// DetectionStatus состояние обработки запроса пользователя
type DetectionStatus int

const (
	// InternalErr ошибка в работе мл модели
	InternalErr DetectionStatus = iota
	// NotEnoughParams недостаточно параметров для выбранной операции
	NotEnoughParams
	// Success операция сгенерирована успешна
	Success
)

// DetectionData запрос пользователя с uuid для идентификации на пользовательской стороне
type DetectionData struct {
	SessionId string
	Query     string
}

// DetectionResult обработки пользовательского запроса к модели
type DetectionResult struct {
	SessionUUID string
	QueryId     int64
	Content     map[string]any
	Status      DetectionStatus
	Response    string
}

// DetectionSessionDao сессия обработки от начала запроса до конечного действия / сценария
type DetectionSessionDao struct {
	Id        int64     `db:"id"`
	Uuid      uuid.UUID `db:"uuid"`
	UserId    int64     `db:"user_id"`
	CreatedAt time.Time `db:"created_at"`
}

// DetectionQueryCreate минимальный набор данных для сохранения запроса
type DetectionQueryCreate struct {
	SessionId    int64
	Content      string          // запрос пользователя
	Label        string          // тип операции обработки мл модели
	Status       DetectionStatus // статус обработки мл модели
	DetectedKeys map[string]any  // ключи, которые выдает модель
}

// DetectionQueryDao запрос пользователя с результатом мл модели
type DetectionQueryDao struct {
	Id            int64           `db:"id"`
	SessionId     int64           `db:"session_id"`
	Content       string          `db:"content"`
	DetectedLabel string          `db:"label"`
	DetectedKeys  map[string]any  `db:"detected_keys"`
	Status        DetectionStatus `db:"status"`
	CreatedAt     time.Time       `db:"created_at"`
}
