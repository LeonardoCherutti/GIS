package service

import (
	"context"
	"fmt"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"

	pwvalidate "gis-api/internal/password"
	"gis-api/internal/repository"
)

type PasswordResetService struct {
	repo        *repository.PasswordResetRepo
	userRepo    *repository.UserRepo
	email       *EmailService
	frontendURL string
}

func NewPasswordResetService(
	repo *repository.PasswordResetRepo,
	userRepo *repository.UserRepo,
	email *EmailService,
	frontendURL string,
) *PasswordResetService {
	return &PasswordResetService{
		repo:        repo,
		userRepo:    userRepo,
		email:       email,
		frontendURL: frontendURL,
	}
}

func (s *PasswordResetService) InitiateReset(ctx context.Context, email string) {
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil || user == nil {
		return
	}
	expiresAt := time.Now().Add(1 * time.Hour)
	token, err := s.repo.Create(ctx, user.ID, expiresAt)
	if err != nil {
		log.Printf("error creating reset token: %v", err)
		return
	}
	resetURL := fmt.Sprintf("%s/reset-password?token=%s", s.frontendURL, token)
	if err := s.email.SendPasswordReset(email, resetURL); err != nil {
		log.Printf("error sending reset email: %v", err)
	}
}

func (s *PasswordResetService) ValidateToken(ctx context.Context, token string) (bool, error) {
	return s.repo.ValidateToken(ctx, token)
}

func (s *PasswordResetService) ResetPassword(ctx context.Context, token, newPassword string) error {
	if err := pwvalidate.Validate(newPassword); err != nil {
		return err
	}
	userID, err := s.repo.ConsumeToken(ctx, token)
	if err != nil {
		return fmt.Errorf("erro ao processar token")
	}
	if userID == "" {
		return fmt.Errorf("link invalido ou expirado")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), 12)
	if err != nil {
		return fmt.Errorf("erro ao gerar hash da senha")
	}
	return s.userRepo.SetPassword(ctx, userID, string(hash))
}
