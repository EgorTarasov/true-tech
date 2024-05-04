package models

// HPU данные для оплаты ЖКХ москвы
// housing and public utilities
type HPU struct {
	PayerCode int    `json:"payerCode"`
	Month     string `json:"month"`
	Year      int    `json:"year"`
	Amount    int64  `json:"amount"`
}

type HPUWithAccountId struct {
	AccountId int64 `json:"accountId"`
	Hpu       HPU   `json:"hpu"`
}

type HPUWithCardData struct {
	BankCardInfo CardInfo `json:"bankCardInfo"`
	Hpu          HPU      `json:"hpu"`
}
