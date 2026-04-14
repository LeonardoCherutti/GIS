package service

import (
	"context"

	"gis-api/internal/model"
	"gis-api/internal/repository"
)

type UserService struct {
	repo        *repository.UserRepo
	invitations *InvitationService
}

func NewUserService(repo *repository.UserRepo, invitations *InvitationService) *UserService {
	return &UserService{repo: repo, invitations: invitations}
}

func (s *UserService) ListUsers(ctx context.Context) ([]model.UserWithHospitals, error) {
	return s.repo.ListAll(ctx)
}

func (s *UserService) CreateManager(ctx context.Context, email string) (*model.User, *model.Invitation, error) {
	user, err := s.repo.CreateManager(ctx, email)
	if err != nil {
		return nil, nil, err
	}
	inv, err := s.invitations.Create(ctx, user.ID)
	if err != nil {
		return user, nil, err
	}
	return user, inv, nil
}

func (s *UserService) RegenerateInvitation(ctx context.Context, userID string) (*model.Invitation, error) {
	return s.invitations.Create(ctx, userID)
}

func (s *UserService) UpdateHospitalAccess(ctx context.Context, userID string, hospitalIDs []string) error {
	return s.repo.UpdateHospitalAccess(ctx, userID, hospitalIDs)
}

func (s *UserService) DeleteUser(ctx context.Context, userID string) error {
	return s.repo.Delete(ctx, userID)
}
