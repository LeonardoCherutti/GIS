package router

import (
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"

	"gis-api/internal/config"
	"gis-api/internal/handler"
	"gis-api/internal/middleware"
	"gis-api/internal/repository"
	"gis-api/internal/service"
)

func New(pool *pgxpool.Pool, cfg *config.Config) chi.Router {
	r := chi.NewRouter()
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(chimw.RequestID)

	// Repositories
	hospitalRepo := repository.NewHospitalRepo(pool)
	userRepo := repository.NewUserRepo(pool)
	invitationRepo := repository.NewInvitationRepo(pool)

	// Services
	invitationService := service.NewInvitationService(invitationRepo, userRepo)
	authService := service.NewAuthService(cfg, userRepo, invitationRepo)
	hospitalService := service.NewHospitalService(hospitalRepo)
	userService := service.NewUserService(userRepo, invitationService)

	// Handlers
	authHandler := handler.NewAuthHandler(authService)
	hospitalHandler := handler.NewHospitalHandler(hospitalService)
	adminHandler := handler.NewAdminHandler(userService)
	invitationHandler := handler.NewInvitationHandler(invitationService, authService)

	// Public routes
	r.Head("/api/health", handler.Health)
	r.Get("/api/health", handler.Health)
	r.Post("/api/auth/login", authHandler.Login)
	r.Post("/api/auth/login-password", authHandler.LoginPassword)
	r.Get("/api/invitations/{token}", invitationHandler.Get)
	r.Post("/api/invitations/{token}/accept-password", invitationHandler.AcceptPassword)
	r.Post("/api/invitations/{token}/accept-google", invitationHandler.AcceptGoogle)

	// Protected routes
	r.Group(func(r chi.Router) {
		r.Use(middleware.Auth(cfg.JWTSecret))
		r.Get("/api/hospitals", hospitalHandler.List)
	})

	// Admin routes
	r.Group(func(r chi.Router) {
		r.Use(middleware.Auth(cfg.JWTSecret))
		r.Use(middleware.RequireAdmin)
		r.Get("/api/admin/users", adminHandler.ListUsers)
		r.Post("/api/admin/users", adminHandler.CreateUser)
		r.Post("/api/admin/users/{id}/invitations", adminHandler.RegenerateInvitation)
		r.Put("/api/admin/users/{id}/hospitals", adminHandler.UpdateHospitals)
		r.Delete("/api/admin/users/{id}", adminHandler.DeleteUser)
	})

	return r
}
