-- Update hospital seed data with real CNES codes, logo URLs, and period dates
-- Data sourced from original index.html and main.js

UPDATE hospitals SET cnes = '0014125', logo_url = '/logos/CenterClinicas.png', period_start = '2021-01-01', period_end = '2025-04-30' WHERE cnes = '0000001';
UPDATE hospitals SET cnes = '2799758', logo_url = NULL, period_start = '2021-01-01', period_end = '2025-12-31' WHERE cnes = '0000002';
UPDATE hospitals SET cnes = '4564812', logo_url = '/logos/Florianopolis.png', period_start = '2021-01-01', period_end = '2026-01-31' WHERE cnes = '0000003';
UPDATE hospitals SET cnes = '2778831', logo_url = '/logos/NT.png', period_start = '2021-01-01', period_end = '2024-11-30' WHERE cnes = '0000004';
UPDATE hospitals SET cnes = '4010868', logo_url = '/logos/CARIRI.png', period_start = '2021-01-01', period_end = '2024-08-31' WHERE cnes = '0000005';
UPDATE hospitals SET cnes = '2564238', logo_url = '/logos/hsa.png', period_start = '2021-01-01', period_end = '2024-08-31' WHERE cnes = '0000006';
UPDATE hospitals SET cnes = '6388671', logo_url = '/logos/zilda_arnss.png', period_start = '2023-01-01', period_end = '2025-12-31' WHERE cnes = '0000007';
UPDATE hospitals SET cnes = '7319770', logo_url = NULL, period_start = '2021-01-01', period_end = '2025-12-31' WHERE cnes = '0000008';
UPDATE hospitals SET cnes = '2232014', logo_url = '/logos/CanoasDasGracas.png', period_start = '2021-01-01', period_end = '2025-05-31' WHERE cnes = '0000009';
UPDATE hospitals SET cnes = '0013846', name = 'Hospital do Rocio', logo_url = NULL, period_start = '2021-01-01', period_end = '2025-12-31' WHERE cnes = '0000010';
UPDATE hospitals SET cnes = '2577623', logo_url = '/logos/hcl.png', period_start = '2021-01-01', period_end = '2024-07-31' WHERE cnes = '0000011';
UPDATE hospitals SET cnes = '2246988', logo_url = NULL, period_start = '2021-01-01', period_end = '2024-07-31' WHERE cnes = '0000012';

-- Update dashboard_configs to reference new CNES codes
UPDATE dashboard_configs SET hospital_id = (SELECT id FROM hospitals WHERE cnes = '0014125') WHERE hospital_id = (SELECT id FROM hospitals WHERE cnes = '0014125');
