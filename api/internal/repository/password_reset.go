package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PasswordResetRepo struct {
	pool *pgxpool.Pool
}

func NewPasswordResetRepo(pool *pgxpool.Pool) *PasswordResetRepo {
	return &PasswordResetRepo{pool: pool}
}

func (r *PasswordResetRepo) Create(ctx context.Context, userID string, expiresAt time.Time) (string, error) {
	_, err := r.pool.Exec(ctx, "DELETE FROM password_resets WHERE user_id = $1", userID)
	if err != nil {
		return "", err
	}
	var token string
	err = r.pool.QueryRow(ctx,
		`INSERT INTO password_resets (user_id, expires_at) VALUES ($1, $2) RETURNING token`,
		userID, expiresAt,
	).Scan(&token)
	return token, err
}

func (r *PasswordResetRepo) ConsumeToken(ctx context.Context, token string) (string, error) {
	var userID string
	err := r.pool.QueryRow(ctx,
		`DELETE FROM password_resets WHERE token = $1 AND expires_at > NOW() RETURNING user_id`,
		token,
	).Scan(&userID)
	if err == pgx.ErrNoRows {
		return "", nil
	}
	return userID, err
}

func (r *PasswordResetRepo) ValidateToken(ctx context.Context, token string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM password_resets WHERE token = $1 AND expires_at > NOW())`,
		token,
	).Scan(&exists)
	return exists, err
}
