package models

// PageCreate данные для обработки страницы
type PageCreate struct {
	Html string `json:"html"`
	Url  string `json:"url"`
}

type PageDao struct {
	Id   int64  `db:"id"`
	Html string `db:"html"`
	Url  string `db:"url"`
}

// Dto преобразование UserDao -> UserDto
func (pd *PageDao) Dto() PageDto {
	return PageDto{
		Id:   pd.Id,
		Html: pd.Html,
		Url:  pd.Url,
	}
}

// PageDto информация о страницы
type PageDto struct {
	Id      int64        `json:"id"`
	Html    string       `json:"html"`
	Url     string       `json:"url"`
	Actions []InputField `json:"actions,omitempty"`
}

// InputField действие, которое можно совершить на странице
type InputField struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	PlaceHolder string `json:"placeholder"`
	Label       string `json:"label"`
	InputMode   string `json:"inputmode"`
	SpellCheck  bool   `json:"spellcheck"`
}

// InputFieldDao представление действия в бд
type InputFieldDao struct {
	Id          int64  `db:"id"`
	Name        string `db:"name"`
	Type        string `db:"type"`
	PlaceHolder string `db:"placeholder"`
	Label       string `db:"label"`
	InputMode   string `db:"inputmode"`
	SpellCheck  bool   `db:"spellcheck"`
}
