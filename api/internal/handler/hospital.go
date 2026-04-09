package handler

import (
	"net/http"

	"gis-api/internal/middleware"
	"gis-api/internal/model"
	"gis-api/internal/service"
)

type HospitalHandler struct {
	service *service.HospitalService
}

func NewHospitalHandler(svc *service.HospitalService) *HospitalHandler {
	return &HospitalHandler{service: svc}
}

func (h *HospitalHandler) List(w http.ResponseWriter, r *http.Request) {
	email, _ := r.Context().Value(middleware.UserEmailKey).(string)
	role, _ := r.Context().Value(middleware.UserRoleKey).(string)

	var hospitals []model.Hospital
	var err error
	if role == "admin" {
		hospitals, err = h.service.ListActive(r.Context())
	} else {
		hospitals, err = h.service.ListByUserAccess(r.Context(), email)
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Erro ao buscar hospitais")
		return
	}
	writeJSON(w, http.StatusOK, hospitals)
}
