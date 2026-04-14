package handler

import (
	"encoding/json"
	"net/http"

	"gis-api/internal/model"
	"gis-api/internal/service"
)

type AuthHandler struct {
	service *service.AuthService
}

func NewAuthHandler(svc *service.AuthService) *AuthHandler {
	return &AuthHandler{service: svc}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req model.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Requisicao invalida")
		return
	}

	if req.GoogleToken == "" {
		writeError(w, http.StatusBadRequest, "Token do Google obrigatorio")
		return
	}

	user, token, err := h.service.VerifyAndLogin(r.Context(), req.GoogleToken)
	if err != nil {
		writeError(w, http.StatusForbidden, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, model.LoginResponse{
		Token: token,
		User:  *user,
	})
}

func (h *AuthHandler) LoginPassword(w http.ResponseWriter, r *http.Request) {
	var req model.PasswordLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Requisicao invalida")
		return
	}
	if req.Email == "" || req.Password == "" {
		writeError(w, http.StatusBadRequest, "Email e senha obrigatorios")
		return
	}
	user, token, err := h.service.PasswordLogin(r.Context(), req.Email, req.Password)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, model.LoginResponse{Token: token, User: *user})
}
