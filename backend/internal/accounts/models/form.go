package models

import (
	"time"
)

// Form - кастомные формы для оплаты и ввода данных

type Form struct {
	Name string `json:"name"`
}

type FormDao struct {
	Id        int64           `db:"id"`
	Name      string          `db:"name"`
	Fields    []InputFieldDao `db:"fields"`
	CreatedAt time.Time       `db:"created_at"`
}

func (fd *FormDao) ToDto() FormDto {
	fields := make([]InputFieldDto, len(fd.Fields))
	for idx, field := range fd.Fields {
		fields[idx] = field.ToDto()
	}
	return FormDto{
		Id:     fd.Id,
		Name:   fd.Name,
		Fields: fields,
	}

}

type InputFieldDao struct {
	Id          int64  `db:"id"`
	Name        string `db:"name"`
	Type        string `db:"type"`
	PlaceHolder string `db:"placeholder"`
	Label       string `db:"label"`
	InputMode   string `db:"inputmode"`
	SpellCheck  bool   `db:"spellcheck"`
}

func (ifd *InputFieldDao) ToDto() InputFieldDto {
	return InputFieldDto{
		Id:          ifd.Id,
		Name:        ifd.Name,
		Type:        ifd.Type,
		PlaceHolder: ifd.PlaceHolder,
		Label:       ifd.Label,
		InputMode:   ifd.InputMode,
		SpellCheck:  ifd.SpellCheck,
	}
}

type InputFieldDto struct {
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	PlaceHolder string `json:"placeholder"`
	Label       string `json:"label"`
	InputMode   string `json:"inputmode"`
	SpellCheck  bool   `json:"spellcheck"`
}

type FormDto struct {
	Id     int64           `json:"id"`
	Name   string          `json:"name"`
	Fields []InputFieldDto `json:"fields"`
}
