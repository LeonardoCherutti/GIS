package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"

	"gis-api/internal/model"
)

type HospitalRepo struct {
	pool *pgxpool.Pool
}

func NewHospitalRepo(pool *pgxpool.Pool) *HospitalRepo {
	return &HospitalRepo{pool: pool}
}

func (r *HospitalRepo) FindAllActive(ctx context.Context) ([]model.Hospital, error) {
	query := `
		SELECT h.id, h.name, h.cnes, h.logo_url, h.period_start, h.period_end,
		       h.sort_order, h.created_at,
		       dc.embed_url
		FROM hospitals h
		LEFT JOIN dashboard_configs dc ON dc.hospital_id = h.id AND dc.active = true
		WHERE h.active = true
		ORDER BY h.sort_order, h.name
	`

	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var hospitals []model.Hospital
	for rows.Next() {
		var h model.Hospital
		var periodStart, periodEnd *string

		err := rows.Scan(
			&h.ID,
			&h.Name,
			&h.CNES,
			&h.LogoURL,
			&periodStart,
			&periodEnd,
			&h.SortOrder,
			&h.CreatedAt,
			&h.PowerBIURL,
		)
		if err != nil {
			return nil, err
		}

		h.PeriodStart = periodStart
		h.PeriodEnd = periodEnd
		hospitals = append(hospitals, h)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	if hospitals == nil {
		hospitals = []model.Hospital{}
	}

	return hospitals, nil
}
