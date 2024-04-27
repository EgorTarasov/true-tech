package constants

type Role int

const (
	User Role = iota
	Admin
	Moderator
)

// Sex Обозначение пола по аналогии с вк
// https://dev.vk.com/ru/reference/objects/user#sex
type Sex int

const (
	Undefined Sex = iota
	Female
	Male
)
