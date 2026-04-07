package model

import "time"

type Hospital struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	CNES        string    `json:"cnes"`
	LogoURL     *string   `json:"logo_url"`
	PeriodStart *string   `json:"period_start"`
	PeriodEnd   *string   `json:"period_end"`
	PowerBIURL  *string   `json:"powerbi_url"`
	SortOrder   int       `json:"sort_order"`
	CreatedAt   time.Time `json:"created_at"`
}
