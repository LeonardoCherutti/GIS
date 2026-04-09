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
	"gis-api/internal/repository"
)

type AuthService struct {
	cfg      *config.Config
	userRepo *repository.UserRepo
}

func NewAuthService(cfg *config.Config, userRepo *repository.UserRepo) *AuthService {
	return &AuthService{cfg: cfg, userRepo: userRepo}
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

	// Look up user in DB
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return nil, "", fmt.Errorf("Erro ao verificar usuario")
	}

	if user == nil {
		// User not in DB -- check if admin email for auto-seed
		if s.isAdminEmail(email) {
			dbUser := &model.User{
				Email:   email,
				Name:    &name,
				Picture: &picture,
				Role:    "admin",
			}
			user, err = s.userRepo.Upsert(ctx, dbUser)
			if err != nil {
				return nil, "", fmt.Errorf("Erro ao criar usuario administrador")
			}
		} else {
			return nil, "", fmt.Errorf("Acesso negado. Contate o administrador.")
		}
	} else {
		// Existing user -- update name/picture from Google profile
		user.Name = &name
		user.Picture = &picture
		user, err = s.userRepo.Upsert(ctx, user)
		if err != nil {
			return nil, "", fmt.Errorf("Erro ao atualizar perfil do usuario")
		}
	}

	authUser := &model.AuthUser{
		Email:   user.Email,
		Name:    name,
		Picture: picture,
		Sub:     sub,
		Role:    user.Role,
	}

	now := time.Now()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":   user.Email,
		"name":    name,
		"picture": picture,
		"sub":     sub,
		"role":    user.Role,
		"iat":     now.Unix(),
		"exp":     now.Add(24 * time.Hour).Unix(),
	})

	signed, err := token.SignedString([]byte(s.cfg.JWTSecret))
	if err != nil {
		return nil, "", fmt.Errorf("Erro ao gerar token")
	}

	return authUser, signed, nil
}

func (s *AuthService) isAdminEmail(email string) bool {
	lower := strings.ToLower(email)
	for _, admin := range s.cfg.AdminEmails {
		if strings.ToLower(admin) == lower {
			return true
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
