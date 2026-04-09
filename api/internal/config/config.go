package config

import (
	"log"
	"os"
	"strings"
)

type Config struct {
	Port           string
	DatabaseURL    string
	GoogleClientID string
	JWTSecret      string
	AdminEmails    []string
	AllowedDomains []string
}

func Load() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "gis-dev-secret-change-in-production"
		log.Println("WARNING: JWT_SECRET not set — using insecure default. Sessions will break on redeploy. Set JWT_SECRET in your environment.")
	}

	return Config{
		Port:           port,
		DatabaseURL:    os.Getenv("DATABASE_URL"),
		GoogleClientID: os.Getenv("GOOGLE_CLIENT_ID"),
		JWTSecret:      jwtSecret,
		AdminEmails:    parseCSV(os.Getenv("ADMIN_EMAILS")),
		AllowedDomains: parseCSV(os.Getenv("ALLOWED_DOMAINS")),
	}
}

func parseCSV(s string) []string {
	if s == "" {
		return nil
	}
	parts := strings.Split(s, ",")
	result := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			result = append(result, p)
		}
	}
	return result
}
