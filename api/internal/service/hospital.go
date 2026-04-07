package service

import (
	"context"

	"gis-api/internal/model"
	"gis-api/internal/repository"
)

type HospitalService struct {
	repo *repository.HospitalRepo
}

func NewHospitalService(repo *repository.HospitalRepo) *HospitalService {
	return &HospitalService{repo: repo}
}

func (s *HospitalService) ListActive(ctx context.Context) ([]model.Hospital, error) {
	return s.repo.FindAllActive(ctx)
}
