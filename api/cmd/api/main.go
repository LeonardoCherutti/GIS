package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"sort"
	"strings"
	"syscall"
	"time"

	"gis-api/internal/config"
	"gis-api/internal/router"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	cfg := config.Load()
	pool, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("unable to connect to database: %v", err)
	}
	defer pool.Close()
	if err := pool.Ping(context.Background()); err != nil {
		log.Fatalf("unable to ping database: %v", err)
	}
	log.Println("connected to database")

	// Run migrations on startup (idempotent — all use IF NOT EXISTS)
	if err := runMigrations(context.Background(), pool); err != nil {
		log.Fatalf("migrations failed: %v", err)
	}

	r := router.New(pool, &cfg)
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", cfg.Port),
		Handler: r,
	}

	go func() {
		log.Printf("server listening on :%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	srv.Shutdown(ctx)
}

func runMigrations(ctx context.Context, pool *pgxpool.Pool) error {
	migrationsDir := "/app/migrations"
	if _, err := os.Stat(migrationsDir); os.IsNotExist(err) {
		migrationsDir = "migrations"
	}
	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		log.Printf("no migrations directory found at %s, skipping", migrationsDir)
		return nil
	}
	var upFiles []string
	for _, e := range entries {
		if !e.IsDir() && strings.HasSuffix(e.Name(), ".up.sql") {
			upFiles = append(upFiles, e.Name())
		}
	}
	sort.Strings(upFiles)
	for _, f := range upFiles {
		sql, err := os.ReadFile(filepath.Join(migrationsDir, f))
		if err != nil {
			return fmt.Errorf("read %s: %w", f, err)
		}
		if _, err := pool.Exec(ctx, string(sql)); err != nil {
			return fmt.Errorf("exec %s: %w", f, err)
		}
		log.Printf("migration applied: %s", f)
	}
	return nil
}
