package config

import (
	"log"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Port           string
	DatabaseURL    string
	GoogleClientID string
	JWTSecret      string
	AdminEmails     []string
	AllowedDomains  []string
	SMTPHost     string
	SMTPPort     int
	SMTPUsername string
	SMTPPassword string
	SMTPFrom     string
	SMTPSecure   bool
	FrontendURL  string
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
		AllowedDomains:  parseCSV(os.Getenv("ALLOWED_DOMAINS")),
		SMTPHost:     os.Getenv("SMTP_HOST"),
		SMTPPort:     parsePort(os.Getenv("SMTP_PORT"), 587),
		SMTPUsername: os.Getenv("SMTP_USERNAME"),
		SMTPPassword: os.Getenv("SMTP_PASSWORD"),
		SMTPFrom:     os.Getenv("SMTP_FROM"),
		SMTPSecure:   os.Getenv("SMTP_SECURE") == "true",
		FrontendURL:  os.Getenv("FRONTEND_URL"),
	}
}

func parsePort(s string, defaultPort int) int {
	if s == "" {
		return defaultPort
	}
	p, err := strconv.Atoi(s)
	if err != nil {
		return defaultPort
	}
	return p
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
