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

	// Services
	authService := service.NewAuthService(cfg, userRepo)
	hospitalService := service.NewHospitalService(hospitalRepo)
	_ = service.NewUserService(userRepo) // Used by admin handler in Plan 03

	// Handlers
	authHandler := handler.NewAuthHandler(authService)
	hospitalHandler := handler.NewHospitalHandler(hospitalService)

	// Public routes
	r.Head("/api/health", handler.Health)
	r.Get("/api/health", handler.Health)
	r.Post("/api/auth/login", authHandler.Login)

	// Protected routes
	r.Group(func(r chi.Router) {
		r.Use(middleware.Auth(cfg.JWTSecret))
		r.Get("/api/hospitals", hospitalHandler.List)
	})

	// Admin routes (handler added in Plan 03)
	r.Group(func(r chi.Router) {
		r.Use(middleware.Auth(cfg.JWTSecret))
		r.Use(middleware.RequireAdmin)
		// Admin endpoints added in Plan 03
	})

	return r
}
