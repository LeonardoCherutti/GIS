package service

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"

	"gis-api/internal/model"
	pwvalidate "gis-api/internal/password"
	"gis-api/internal/repository"
)

const InvitationTTL = 7 * 24 * time.Hour

type InvitationService struct {
	repo     *repository.InvitationRepo
	userRepo *repository.UserRepo
}

func NewInvitationService(repo *repository.InvitationRepo, userRepo *repository.UserRepo) *InvitationService {
	return &InvitationService{repo: repo, userRepo: userRepo}
}

func generateToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func (s *InvitationService) Create(ctx context.Context, userID string) (*model.Invitation, error) {
	token, err := generateToken()
	if err != nil {
		return nil, err
	}
	expiresAt := time.Now().Add(InvitationTTL)
	return s.repo.Create(ctx, userID, token, expiresAt)
}

func (s *InvitationService) FindValid(ctx context.Context, token string) (*repository.InvitationWithEmail, error) {
	inv, err := s.repo.FindByToken(ctx, token)
	if err != nil {
		return nil, err
	}
	if inv == nil {
		return nil, fmt.Errorf("convite nao encontrado")
	}
	if inv.UsedAt != nil {
		return nil, fmt.Errorf("convite ja utilizado")
	}
	if inv.ExpiresAt.Before(time.Now()) {
		return nil, fmt.Errorf("convite expirado")
	}
	return inv, nil
}

func (s *InvitationService) AcceptPassword(ctx context.Context, token, password string) (string, error) {
	inv, err := s.FindValid(ctx, token)
	if err != nil {
		return "", err
	}
	if err := pwvalidate.Validate(password); err != nil {
		return "", err
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return "", fmt.Errorf("erro ao gerar hash da senha")
	}
	if err := s.userRepo.SetPassword(ctx, inv.UserID, string(hash)); err != nil {
		return "", fmt.Errorf("erro ao salvar senha")
	}
	if err := s.repo.MarkUsed(ctx, inv.ID); err != nil {
		return "", fmt.Errorf("erro ao marcar convite como utilizado")
	}
	return inv.Email, nil
}

func (s *InvitationService) AcceptAndMarkUsedByEmail(ctx context.Context, userID string) {
	_ = s.repo.MarkUsedByUserID(ctx, userID)
}
