package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"

	"gis-api/internal/model"
	"gis-api/internal/service"
)

type PasswordResetHandler struct {
	service *service.PasswordResetService
}

func NewPasswordResetHandler(svc *service.PasswordResetService) *PasswordResetHandler {
	return &PasswordResetHandler{service: svc}
}

func (h *PasswordResetHandler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req model.ForgotPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Requisicao invalida")
		return
	}
	if req.Email == "" {
		writeError(w, http.StatusBadRequest, "Email obrigatorio")
		return
	}
	go h.service.InitiateReset(context.Background(), req.Email)
	writeJSON(w, http.StatusOK, map[string]string{
		"message": "Se o email estiver cadastrado, voce recebera um link de recuperacao",
	})
}

func (h *PasswordResetHandler) ValidateToken(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")
	if token == "" {
		writeError(w, http.StatusBadRequest, "Token obrigatorio")
		return
	}
	valid, err := h.service.ValidateToken(r.Context(), token)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Erro interno")
		return
	}
	if !valid {
		writeError(w, http.StatusBadRequest, "Link invalido ou expirado")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"valid": true})
}

func (h *PasswordResetHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")
	if token == "" {
		writeError(w, http.StatusBadRequest, "Token obrigatorio")
		return
	}
	var req model.ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Requisicao invalida")
		return
	}
	if req.Password != req.ConfirmPassword {
		writeError(w, http.StatusBadRequest, "As senhas nao coincidem")
		return
	}
	if err := h.service.ResetPassword(r.Context(), token, req.Password); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "Senha redefinida com sucesso"})
}
