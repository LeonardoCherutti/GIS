package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"gis-api/internal/model"
)

type UserRepo struct {
	pool *pgxpool.Pool
}

func NewUserRepo(pool *pgxpool.Pool) *UserRepo {
	return &UserRepo{pool: pool}
}

func (r *UserRepo) FindByEmail(ctx context.Context, email string) (*model.User, error) {
	query := `
		SELECT id, email, name, picture, role, created_at, updated_at
		FROM users
		WHERE email = $1
	`

	var u model.User
	err := r.pool.QueryRow(ctx, query, email).Scan(
		&u.ID, &u.Email, &u.Name, &u.Picture, &u.Role, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *UserRepo) Upsert(ctx context.Context, user *model.User) (*model.User, error) {
	query := `
		INSERT INTO users (email, name, picture, role)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (email) DO UPDATE SET
			name = COALESCE(EXCLUDED.name, users.name),
			picture = COALESCE(EXCLUDED.picture, users.picture),
			role = EXCLUDED.role,
			updated_at = NOW()
		RETURNING id, email, name, picture, role, created_at, updated_at
	`

	var u model.User
	err := r.pool.QueryRow(ctx, query, user.Email, user.Name, user.Picture, user.Role).Scan(
		&u.ID, &u.Email, &u.Name, &u.Picture, &u.Role, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepo) CreateManager(ctx context.Context, email string) (*model.User, error) {
	query := `
		INSERT INTO users (email, role)
		VALUES ($1, 'manager')
		RETURNING id, email, name, picture, role, created_at, updated_at
	`

	var u model.User
	err := r.pool.QueryRow(ctx, query, email).Scan(
		&u.ID, &u.Email, &u.Name, &u.Picture, &u.Role, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepo) ListAll(ctx context.Context) ([]model.UserWithHospitals, error) {
	query := `
		SELECT u.id, u.email, u.name, u.picture, u.role, u.created_at, u.updated_at,
		       h.id, h.name, h.cnes
		FROM users u
		LEFT JOIN user_hospitals uh ON uh.user_id = u.id
		LEFT JOIN hospitals h ON h.id = uh.hospital_id
		ORDER BY u.email, h.sort_order, h.name
	`

	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	userMap := make(map[string]*model.UserWithHospitals)
	var order []string

	for rows.Next() {
		var u model.User
		var hID, hName, hCNES *string

		err := rows.Scan(
			&u.ID, &u.Email, &u.Name, &u.Picture, &u.Role, &u.CreatedAt, &u.UpdatedAt,
			&hID, &hName, &hCNES,
		)
		if err != nil {
			return nil, err
		}

		uw, exists := userMap[u.ID]
		if !exists {
			uw = &model.UserWithHospitals{
				User:      u,
				Hospitals: []model.Hospital{},
			}
			userMap[u.ID] = uw
			order = append(order, u.ID)
		}

		if hID != nil {
			uw.Hospitals = append(uw.Hospitals, model.Hospital{
				ID:   *hID,
				Name: *hName,
				CNES: *hCNES,
			})
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	result := make([]model.UserWithHospitals, 0, len(order))
	for _, id := range order {
		result = append(result, *userMap[id])
	}
	return result, nil
}

func (r *UserRepo) UpdateHospitalAccess(ctx context.Context, userID string, hospitalIDs []string) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, "DELETE FROM user_hospitals WHERE user_id = $1", userID)
	if err != nil {
		return err
	}

	for _, hID := range hospitalIDs {
		_, err = tx.Exec(ctx,
			"INSERT INTO user_hospitals (user_id, hospital_id) VALUES ($1, $2)",
			userID, hID,
		)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

func (r *UserRepo) Delete(ctx context.Context, userID string) error {
	_, err := r.pool.Exec(ctx, "DELETE FROM users WHERE id = $1", userID)
	return err
}

func (r *UserRepo) SetPassword(ctx context.Context, userID, passwordHash string) error {
	_, err := r.pool.Exec(ctx,
		"UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
		passwordHash, userID,
	)
	return err
}

func (r *UserRepo) FindByEmailWithPassword(ctx context.Context, email string) (*model.User, string, error) {
	query := `
		SELECT id, email, name, picture, role, created_at, updated_at, COALESCE(password_hash, '')
		FROM users
		WHERE email = $1
	`
	var u model.User
	var hash string
	err := r.pool.QueryRow(ctx, query, email).Scan(
		&u.ID, &u.Email, &u.Name, &u.Picture, &u.Role, &u.CreatedAt, &u.UpdatedAt, &hash,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, "", nil
		}
		return nil, "", err
	}
	return &u, hash, nil
}
