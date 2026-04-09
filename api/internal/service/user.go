package service

import (
	"context"

	"gis-api/internal/model"
	"gis-api/internal/repository"
)

type UserService struct {
	repo *repository.UserRepo
}

func NewUserService(repo *repository.UserRepo) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) ListUsers(ctx context.Context) ([]model.UserWithHospitals, error) {
	return s.repo.ListAll(ctx)
}

func (s *UserService) CreateManager(ctx context.Context, email string) (*model.User, error) {
	return s.repo.CreateManager(ctx, email)
}

func (s *UserService) UpdateHospitalAccess(ctx context.Context, userID string, hospitalIDs []string) error {
	return s.repo.UpdateHospitalAccess(ctx, userID, hospitalIDs)
}

func (s *UserService) DeleteUser(ctx context.Context, userID string) error {
	return s.repo.Delete(ctx, userID)
}
