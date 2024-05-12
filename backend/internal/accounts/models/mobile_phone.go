package models

// TODO: Phone validation

type PhoneReFillData struct {
	Number string `json:"phoneNumber"`
	Amount int64  `json:"amount"`
}

type PhoneRefillDataWithAccountId struct {
	AccountId int64           `json:"accountId"`
	PhoneData PhoneReFillData `json:"phoneData"`
}

type PhoneRefillDataWithCardData struct {
	PhoneData    PhoneReFillData `json:"phoneData"`
	BankCardInfo CardInfo        `json:"bankCardInfo"`
}
