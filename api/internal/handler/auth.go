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

	tokenType := req.TokenType
	if tokenType == "" {
		tokenType = "id_token"
	}
	user, token, err := h.service.VerifyAndLogin(r.Context(), req.GoogleToken, tokenType)
	if err != nil {
		writeError(w, http.StatusForbidden, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, model.LoginResponse{
		Token: token,
		User:  *user,
	})
}
