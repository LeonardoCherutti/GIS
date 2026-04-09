package model

import "time"

type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      *string   `json:"name"`
	Picture   *string   `json:"picture"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type UserWithHospitals struct {
	User
	Hospitals []Hospital `json:"hospitals"`
}

type CreateUserRequest struct {
	Email string `json:"email"`
}

type UpdateHospitalsRequest struct {
	HospitalIDs []string `json:"hospital_ids"`
}
