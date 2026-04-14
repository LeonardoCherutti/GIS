package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"

	"gis-api/internal/model"
	"gis-api/internal/service"
)

type InvitationHandler struct {
	invitations *service.InvitationService
	auth        *service.AuthService
}

func NewInvitationHandler(inv *service.InvitationService, auth *service.AuthService) *InvitationHandler {
	return &InvitationHandler{invitations: inv, auth: auth}
}

func (h *InvitationHandler) Get(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")
	inv, err := h.invitations.FindValid(r.Context(), token)
	if err != nil {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, model.InvitationInfo{
		Email:     inv.Email,
		ExpiresAt: inv.ExpiresAt,
	})
}

func (h *InvitationHandler) AcceptPassword(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")
	var req model.AcceptPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Requisicao invalida")
		return
	}
	email, err := h.invitations.AcceptPassword(r.Context(), token, req.Password)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	authUser, jwt, err := h.auth.PasswordLogin(r.Context(), email, req.Password)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Erro ao autenticar apos cadastro")
		return
	}
	writeJSON(w, http.StatusOK, model.LoginResponse{Token: jwt, User: *authUser})
}

func (h *InvitationHandler) AcceptGoogle(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")
	var req model.AcceptGoogleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Requisicao invalida")
		return
	}

	inv, err := h.invitations.FindValid(r.Context(), token)
	if err != nil {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}

	googleEmail, err := h.auth.GoogleTokenEmail(r.Context(), req.GoogleToken)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err.Error())
		return
	}
	if !strings.EqualFold(googleEmail, inv.Email) {
		writeError(w, http.StatusForbidden, "Email do Google nao corresponde ao convite")
		return
	}

	authUser, jwt, err := h.auth.VerifyAndLogin(r.Context(), req.GoogleToken)
	if err != nil {
		writeError(w, http.StatusForbidden, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, model.LoginResponse{Token: jwt, User: *authUser})
}
