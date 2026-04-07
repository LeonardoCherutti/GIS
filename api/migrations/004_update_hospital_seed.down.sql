-- Revert hospital seed data back to placeholder CNES codes

UPDATE hospitals SET cnes = '0000001', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '0014125';
UPDATE hospitals SET cnes = '0000002', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '2799758';
UPDATE hospitals SET cnes = '0000003', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '4564812';
UPDATE hospitals SET cnes = '0000004', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '2778831';
UPDATE hospitals SET cnes = '0000005', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '4010868';
UPDATE hospitals SET cnes = '0000006', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '2564238';
UPDATE hospitals SET cnes = '0000007', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '6388671';
UPDATE hospitals SET cnes = '0000008', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '7319770';
UPDATE hospitals SET cnes = '0000009', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '2232014';
UPDATE hospitals SET cnes = '0000010', name = 'Hospital Nsa. Sra. do Perpétuo Socorro', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '0013846';
UPDATE hospitals SET cnes = '0000011', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '2577623';
UPDATE hospitals SET cnes = '0000012', logo_url = NULL, period_start = NULL, period_end = NULL WHERE cnes = '2246988';
