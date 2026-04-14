package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/idtoken"

	"gis-api/internal/config"
	"gis-api/internal/model"
	"gis-api/internal/repository"
)

type AuthService struct {
	cfg            *config.Config
	userRepo       *repository.UserRepo
	invitationRepo *repository.InvitationRepo
}

func NewAuthService(cfg *config.Config, userRepo *repository.UserRepo, invitationRepo *repository.InvitationRepo) *AuthService {
	return &AuthService{cfg: cfg, userRepo: userRepo, invitationRepo: invitationRepo}
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

	// Admin emails from env bypass the DB entirely -- they must always be able to log in
	// even if the DB is down or the user row is missing. Best-effort upsert for audit/UI.
	if s.isAdminEmail(email) {
		dbUser := &model.User{
			Email:   email,
			Name:    &name,
			Picture: &picture,
			Role:    "admin",
		}
		_, _ = s.userRepo.Upsert(ctx, dbUser)
		return s.issueToken(email, name, picture, sub, "admin")
	}

	// Look up user in DB
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return nil, "", fmt.Errorf("Erro ao verificar usuario")
	}

	if user == nil {
		if s.isAllowedDomain(email) {
			// Domain-level gate: auto-create as manager
			dbUser := &model.User{
				Email:   email,
				Name:    &name,
				Picture: &picture,
				Role:    "manager",
			}
			user, err = s.userRepo.Upsert(ctx, dbUser)
			if err != nil {
				return nil, "", fmt.Errorf("Erro ao criar usuario")
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

	// Silently consume any pending invitation now that the invited user has authenticated.
	_ = s.invitationRepo.MarkUsedByUserID(ctx, user.ID)

	return s.issueToken(user.Email, name, picture, sub, user.Role)
}

func (s *AuthService) PasswordLogin(ctx context.Context, email, password string) (*model.AuthUser, string, error) {
	user, hash, err := s.userRepo.FindByEmailWithPassword(ctx, strings.ToLower(strings.TrimSpace(email)))
	if err != nil {
		return nil, "", fmt.Errorf("Erro ao verificar credenciais")
	}
	if user == nil || hash == "" {
		return nil, "", fmt.Errorf("Credenciais invalidas")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return nil, "", fmt.Errorf("Credenciais invalidas")
	}
	name := ""
	if user.Name != nil {
		name = *user.Name
	}
	picture := ""
	if user.Picture != nil {
		picture = *user.Picture
	}
	return s.issueToken(user.Email, name, picture, user.ID, user.Role)
}

func (s *AuthService) GoogleTokenEmail(ctx context.Context, googleToken string) (string, error) {
	payload, err := idtoken.Validate(ctx, googleToken, s.cfg.GoogleClientID)
	if err != nil {
		return "", fmt.Errorf("Token do Google invalido")
	}
	email, _ := payload.Claims["email"].(string)
	return strings.ToLower(email), nil
}

func (s *AuthService) issueToken(email, name, picture, sub, role string) (*model.AuthUser, string, error) {
	authUser := &model.AuthUser{
		Email:   email,
		Name:    name,
		Picture: picture,
		Sub:     sub,
		Role:    role,
	}

	now := time.Now()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":   email,
		"name":    name,
		"picture": picture,
		"sub":     sub,
		"role":    role,
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

func (s *AuthService) isAllowedDomain(email string) bool {
	parts := strings.SplitN(strings.ToLower(email), "@", 2)
	if len(parts) != 2 {
		return false
	}
	domain := parts[1]
	for _, allowed := range s.cfg.AllowedDomains {
		if strings.ToLower(allowed) == domain {
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
