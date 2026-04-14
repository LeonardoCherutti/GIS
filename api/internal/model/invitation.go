package model

import "time"

type Invitation struct {
	ID        string     `json:"id"`
	UserID    string     `json:"user_id"`
	Token     string     `json:"token"`
	ExpiresAt time.Time  `json:"expires_at"`
	UsedAt    *time.Time `json:"used_at"`
	CreatedAt time.Time  `json:"created_at"`
}

type InvitationInfo struct {
	Email     string    `json:"email"`
	ExpiresAt time.Time `json:"expires_at"`
}

type AcceptPasswordRequest struct {
	Password string `json:"password"`
}

type AcceptGoogleRequest struct {
	GoogleToken string `json:"google_token"`
}

type PasswordLoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreateUserResponse struct {
	User           User   `json:"user"`
	InvitationURL  string `json:"invitation_url,omitempty"`
	InvitationToken string `json:"invitation_token,omitempty"`
	ExpiresAt      time.Time `json:"expires_at,omitempty"`
}
