package service

import (
	"fmt"
	"log"

	"github.com/resend/resend-go/v3"
)

type EmailService struct {
	client   *resend.Client
	fromAddr string
}

func NewEmailService(apiKey, fromAddr string) *EmailService {
	if apiKey == "" {
		log.Println("WARNING: RESEND_API_KEY not set — password reset emails will be logged to console only")
		return &EmailService{fromAddr: fromAddr}
	}
	return &EmailService{
		client:   resend.NewClient(apiKey),
		fromAddr: fromAddr,
	}
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

	if s.client == nil {
		log.Printf("DEV MODE — Reset email for %s: %s", toEmail, resetURL)
		return nil
	}

	_, err := s.client.Emails.Send(&resend.SendEmailRequest{
		From:    s.fromAddr,
		To:      []string{toEmail},
		Subject: "Redefinicao de Senha - GSI",
		Html:    html,
	})
	return err
}
