-- Seed all 12 hospitals from existing main.js configuration
INSERT INTO hospitals (name, cnes, sort_order, active) VALUES
    ('Hospital Center Clínicas',                        '0000001', 1,  true),
    ('Hospital Geral Clériston Andrade',                '0000002', 2,  true),
    ('UPAs Florianópolis',                              '0000003', 3,  true),
    ('Hospital Nsa. Sra. da Imaculada Conceição',       '0000004', 4,  true),
    ('Hospital do Coração de Cariri',                   '0000005', 5,  true),
    ('Maternidade Santo Antônio HMSA',                  '0000006', 6,  true),
    ('Hospital do Idoso Zilda Arns',                    '0000007', 7,  true),
    ('Hospital Municipal Dr. Ricardo de Tadeu Ladeia',  '0000008', 8,  true),
    ('Hospital Nsa. Sra. Das Graças',                   '0000009', 9,  true),
    ('Hospital Nsa. Sra. do Perpétuo Socorro',          '0000010', 10, true),
    ('Hospital do Câncer de Londrina',                  '0000011', 11, true),
    ('Hospital São Vicente de Paulo',                   '0000012', 12, true);

-- Seed dashboard configurations with Power BI embed URLs
INSERT INTO dashboard_configs (hospital_id, name, embed_url, active) VALUES
    ((SELECT id FROM hospitals WHERE cnes = '0000001'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiNjJhZjcyYjAtYzI4Ni00NDVmLWE3NmUtNDk1MjA4YTY4ZmVlIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', true),
    ((SELECT id FROM hospitals WHERE cnes = '0000002'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiMmQ0ZmFiNGQtZmQ3OC00ZWU5LTk5MjYtYmQyZTU4NzlmOTZhIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', true),
    ((SELECT id FROM hospitals WHERE cnes = '0000003'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiMjZlMWJiNGMtZDkyYi00YTQwLWIyYzgtZDFlZGQxOWY3MjgxIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9&pageName=91184a9ff5a9166b63e0', true),
    ((SELECT id FROM hospitals WHERE cnes = '0000004'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiNDExNGVmOGUtY2FhYS00NWYyLTg4NTctODUyZGVlMDY4ZjIyIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', true),
    ((SELECT id FROM hospitals WHERE cnes = '0000005'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiNzdhZDIxYTQtN2M0My00MDA0LTg1OGEtZTFkMDMxYmYwMzM4IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', true),
    ((SELECT id FROM hospitals WHERE cnes = '0000006'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiNjRmMDM0OTgtNmQ4ZS00YzRhLThjMDAtNzg0ODMwMjFlYjg0IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', true),
    ((SELECT id FROM hospitals WHERE cnes = '0000007'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiYjdlN2UzNjQtZDRiYi00ZGM5LWE0MjItOWQyODg4NjhlMzNlIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', true),
    ((SELECT id FROM hospitals WHERE cnes = '0000008'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiMzUyZGU3MTQtMDIzMC00ZWUyLTk5MDYtYTBkOTQyZWM1NjI4IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', true),
    ((SELECT id FROM hospitals WHERE cnes = '0000009'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiMjE5OWFjOGItMzU2Zi00MDNlLTg2YzMtZmEwZDdmYTQ2YjE0IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', true),
    ((SELECT id FROM hospitals WHERE cnes = '0000010'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiN2E0ZDA5OGItNDU5OC00YzU4LTgzZmItNTQ5NjI2ZmI0MGI1IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', true),
    ((SELECT id FROM hospitals WHERE cnes = '0000011'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiNjNjMzczYzItMjZlMC00MjliLTgzYTItNDUyZWI1MTFkZjQwIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', true),
    ((SELECT id FROM hospitals WHERE cnes = '0000012'), 'Principal', 'https://app.powerbi.com/view?r=eyJrIjoiYWVjNjdlZDQtOTE3Yy00ZDNhLWE0MDQtNzNhZDcxOWRkOGEzIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', true);
