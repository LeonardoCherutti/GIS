package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgconn"

	"gis-api/internal/model"
	"gis-api/internal/service"
)

type AdminHandler struct {
	service *service.UserService
}

func NewAdminHandler(svc *service.UserService) *AdminHandler {
	return &AdminHandler{service: svc}
}

func (h *AdminHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.service.ListUsers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Erro ao buscar usuarios")
		return
	}
	writeJSON(w, http.StatusOK, users)
}

func (h *AdminHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req model.CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Requisicao invalida")
		return
	}

	if strings.TrimSpace(req.Email) == "" {
		writeError(w, http.StatusBadRequest, "Email obrigatorio")
		return
	}

	user, inv, err := h.service.CreateManager(r.Context(), req.Email)
	if err != nil {
		if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
			writeError(w, http.StatusConflict, "Usuario ja existe")
			return
		}
		writeError(w, http.StatusInternalServerError, "Erro ao criar usuario")
		return
	}
	resp := model.CreateUserResponse{User: *user}
	if inv != nil {
		resp.InvitationToken = inv.Token
		resp.ExpiresAt = inv.ExpiresAt
	}
	writeJSON(w, http.StatusCreated, resp)
}

func (h *AdminHandler) RegenerateInvitation(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")
	inv, err := h.service.RegenerateInvitation(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Erro ao gerar convite")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"invitation_token": inv.Token,
		"expires_at":       inv.ExpiresAt,
	})
}

func (h *AdminHandler) UpdateHospitals(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")

	var req model.UpdateHospitalsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Requisicao invalida")
		return
	}

	if err := h.service.UpdateHospitalAccess(r.Context(), userID, req.HospitalIDs); err != nil {
		writeError(w, http.StatusInternalServerError, "Erro ao atualizar hospitais")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (h *AdminHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")

	if err := h.service.DeleteUser(r.Context(), userID); err != nil {
		writeError(w, http.StatusInternalServerError, "Erro ao remover usuario")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}
