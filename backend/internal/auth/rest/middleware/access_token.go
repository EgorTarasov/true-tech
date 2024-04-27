package middleware

import (
	"github.com/EgorTarasov/true-tech/backend/internal/auth/token"
	jwtware "github.com/gofiber/contrib/jwt"
)

var UserClaimsMiddleware = jwtware.New(jwtware.Config{
	SigningKey: jwtware.SigningKey{Key: []byte(token.Key)},
	ContextKey: "userClaims",
	Claims:     &token.UserClaims{},
	KeyFunc:    nil,
	JWKSetURLs: nil,
})
