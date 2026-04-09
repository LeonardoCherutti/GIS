package model

type AuthUser struct {
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	Sub     string `json:"sub"`
	Role    string `json:"role"`
}

type LoginRequest struct {
	GoogleToken string `json:"google_token"`
}

type LoginResponse struct {
	Token string   `json:"token"`
	User  AuthUser `json:"user"`
}
