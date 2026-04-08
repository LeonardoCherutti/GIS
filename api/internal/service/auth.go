package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/api/idtoken"

	"gis-api/internal/config"
	"gis-api/internal/model"
)

type AuthService struct {
	cfg *config.Config
}

func NewAuthService(cfg *config.Config) *AuthService {
	return &AuthService{cfg: cfg}
}

func (s *AuthService) VerifyAndLogin(ctx context.Context, googleToken string) (*model.AuthUser, string, error) {
	payload, err := idtoken.Validate(ctx, googleToken, s.cfg.GoogleClientID)
	if err != nil {
		return nil, "", fmt.Errorf("Token do Google invalido")
	}

	email, _ := payload.Claims["email"].(string)
	name, _ := payload.Claims["name"].(string)
	picture, _ := payload.Claims["picture"].(string)
	sub := payload.Subject

	if !s.isAllowed(email) {
		return nil, "", fmt.Errorf("Email nao autorizado")
	}

	user := &model.AuthUser{
		Email:   email,
		Name:    name,
		Picture: picture,
		Sub:     sub,
	}

	now := time.Now()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":   email,
		"name":    name,
		"picture": picture,
		"sub":     sub,
		"iat":     now.Unix(),
		"exp":     now.Add(24 * time.Hour).Unix(),
	})

	signed, err := token.SignedString([]byte(s.cfg.JWTSecret))
	if err != nil {
		return nil, "", fmt.Errorf("Erro ao gerar token")
	}

	return user, signed, nil
}

func (s *AuthService) isAllowed(email string) bool {
	lower := strings.ToLower(email)

	for _, allowed := range s.cfg.AllowedEmails {
		if strings.ToLower(allowed) == lower {
			return true
		}
	}

	parts := strings.SplitN(lower, "@", 2)
	if len(parts) == 2 {
		domain := parts[1]
		for _, allowed := range s.cfg.AllowedDomains {
			if strings.ToLower(allowed) == domain {
				return true
			}
		}
	}

	return false
}

func (s *AuthService) ValidateSessionToken(tokenStr string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("metodo de assinatura inesperado: %v", t.Header["alg"])
		}
		return []byte(s.cfg.JWTSecret), nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("token invalido")
	}

	return claims, nil
}
