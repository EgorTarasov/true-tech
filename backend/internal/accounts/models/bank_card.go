package models

// TODO: Card Number and ExpirationDate validation

type CardInfo struct {
	Number         int64  `json:"cardNumber" validate:"min:"`
	ExpirationDate string `json:"expirationDate" validate:"required,max=7,min=7"`
	CVC            int    `json:"cvc"`
}
