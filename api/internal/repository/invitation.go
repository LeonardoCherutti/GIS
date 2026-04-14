package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"gis-api/internal/model"
)

type InvitationRepo struct {
	pool *pgxpool.Pool
}

func NewInvitationRepo(pool *pgxpool.Pool) *InvitationRepo {
	return &InvitationRepo{pool: pool}
}

func (r *InvitationRepo) Create(ctx context.Context, userID, token string, expiresAt time.Time) (*model.Invitation, error) {
	query := `
		INSERT INTO invitations (user_id, token, expires_at)
		VALUES ($1, $2, $3)
		RETURNING id, user_id, token, expires_at, used_at, created_at
	`
	var inv model.Invitation
	err := r.pool.QueryRow(ctx, query, userID, token, expiresAt).Scan(
		&inv.ID, &inv.UserID, &inv.Token, &inv.ExpiresAt, &inv.UsedAt, &inv.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &inv, nil
}

type InvitationWithEmail struct {
	model.Invitation
	Email string
}

func (r *InvitationRepo) FindByToken(ctx context.Context, token string) (*InvitationWithEmail, error) {
	query := `
		SELECT i.id, i.user_id, i.token, i.expires_at, i.used_at, i.created_at, u.email
		FROM invitations i
		JOIN users u ON u.id = i.user_id
		WHERE i.token = $1
	`
	var inv InvitationWithEmail
	err := r.pool.QueryRow(ctx, query, token).Scan(
		&inv.ID, &inv.UserID, &inv.Token, &inv.ExpiresAt, &inv.UsedAt, &inv.CreatedAt, &inv.Email,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &inv, nil
}

func (r *InvitationRepo) MarkUsed(ctx context.Context, id string) error {
	_, err := r.pool.Exec(ctx, "UPDATE invitations SET used_at = NOW() WHERE id = $1", id)
	return err
}

func (r *InvitationRepo) MarkUsedByUserID(ctx context.Context, userID string) error {
	_, err := r.pool.Exec(ctx,
		"UPDATE invitations SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL",
		userID,
	)
	return err
}

func (r *InvitationRepo) FindLatestPendingByUserID(ctx context.Context, userID string) (*model.Invitation, error) {
	query := `
		SELECT id, user_id, token, expires_at, used_at, created_at
		FROM invitations
		WHERE user_id = $1 AND used_at IS NULL AND expires_at > NOW()
		ORDER BY created_at DESC
		LIMIT 1
	`
	var inv model.Invitation
	err := r.pool.QueryRow(ctx, query, userID).Scan(
		&inv.ID, &inv.UserID, &inv.Token, &inv.ExpiresAt, &inv.UsedAt, &inv.CreatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &inv, nil
}
