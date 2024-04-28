package models

import (
	"encoding/binary"

	"github.com/go-webauthn/webauthn/webauthn"
)

// WebAuthUser формат данных для авторизации через webauth n
//
// docs: https://github.com/go-webauthn/webauthn
// example: https://webauthn.io/
type WebAuthUser struct {
	Id          int64                 `db:"id"`
	Name        string                `db:"name"`
	DisplayName string                `db:"display_name"`
	Icon        string                `db:"icon"`
	CredJson    []webauthn.Credential `db:"credentials"`
}

func (wau *WebAuthUser) WebAuthnID() []byte {
	b := make([]byte, 8)
	binary.LittleEndian.PutUint64(b, uint64(wau.Id))
	return b
}

func (wau *WebAuthUser) WebAuthnName() string {
	return "newUser"
}

func (wau *WebAuthUser) WebAuthnDisplayName() string {
	return "New User"
}

func (wau *WebAuthUser) WebAuthnIcon() string {
	return "https://pics.com/avatar.png"
}

func (wau *WebAuthUser) WebAuthnCredentials() []webauthn.Credential {
	return []webauthn.Credential{}
}
