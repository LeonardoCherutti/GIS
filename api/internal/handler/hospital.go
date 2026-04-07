package handler

import (
	"net/http"

	"gis-api/internal/service"
)

type HospitalHandler struct {
	service *service.HospitalService
}

func NewHospitalHandler(svc *service.HospitalService) *HospitalHandler {
	return &HospitalHandler{service: svc}
}

func (h *HospitalHandler) List(w http.ResponseWriter, r *http.Request) {
	hospitals, err := h.service.ListActive(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Erro ao buscar hospitais")
		return
	}

	writeJSON(w, http.StatusOK, hospitals)
}
