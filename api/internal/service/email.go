package service

import (
	"crypto/tls"
	"fmt"
	"log"
	"net"
	"net/smtp"
	"strconv"
)

type SMTPConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string
	Secure   bool
}

type EmailService struct {
	cfg SMTPConfig
}

func NewEmailService(cfg SMTPConfig) *EmailService {
	if cfg.Host == "" {
		log.Println("WARNING: SMTP_HOST not set — password reset emails will be logged to console only")
	}
	return &EmailService{cfg: cfg}
}

func (s *EmailService) SendPasswordReset(toEmail, resetURL string) error {
	html := fmt.Sprintf(`<!DOCTYPE html>
<html>
<body style="font-family: 'Open Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #0B5FA5;">Redefinicao de Senha</h2>
  <p>Voce solicitou a redefinicao de sua senha no GSI.</p>
  <p><a href="%s" style="display: inline-block; padding: 12px 24px; background: #0B5FA5; color: white; text-decoration: none; border-radius: 6px;">Redefinir Senha</a></p>
  <p style="color: #666; font-size: 14px;">Este link expira em 1 hora. Se voce nao solicitou esta alteracao, ignore este email.</p>
</body>
</html>`, resetURL)

	if s.cfg.Host == "" {
		log.Printf("DEV MODE — Reset email for %s: %s", toEmail, resetURL)
		return nil
	}

	subject := "Redefinicao de Senha - GSI"
	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=\"UTF-8\"\r\n\r\n%s",
		s.cfg.From, toEmail, subject, html)

	addr := net.JoinHostPort(s.cfg.Host, strconv.Itoa(s.cfg.Port))
	auth := smtp.PlainAuth("", s.cfg.Username, s.cfg.Password, s.cfg.Host)

	if s.cfg.Secure {
		tlsConfig := &tls.Config{ServerName: s.cfg.Host}
		conn, err := tls.Dial("tcp", addr, tlsConfig)
		if err != nil {
			return fmt.Errorf("smtp tls dial: %w", err)
		}
		client, err := smtp.NewClient(conn, s.cfg.Host)
		if err != nil {
			return fmt.Errorf("smtp client: %w", err)
		}
		defer client.Close()
		if err := client.Auth(auth); err != nil {
			return fmt.Errorf("smtp auth: %w", err)
		}
		if err := client.Mail(s.cfg.From); err != nil {
			return fmt.Errorf("smtp mail: %w", err)
		}
		if err := client.Rcpt(toEmail); err != nil {
			return fmt.Errorf("smtp rcpt: %w", err)
		}
		w, err := client.Data()
		if err != nil {
			return fmt.Errorf("smtp data: %w", err)
		}
		if _, err := w.Write([]byte(msg)); err != nil {
			return fmt.Errorf("smtp write: %w", err)
		}
		return w.Close()
	}

	return smtp.SendMail(addr, auth, s.cfg.From, []string{toEmail}, []byte(msg))
}
