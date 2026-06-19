import { NextRequest, NextResponse } from 'next/server'

// Pre-computed JWT with payload: { email, name, picture, sub, role: 'admin', exp: 9999999999 }
// Signature is not validated client-side — parseJwt() only base64-decodes the payload.
export const DEV_MOCK_JWT =
  'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0' +
  '.eyJlbWFpbCI6ImRldkBnaXMubG9jYWwiLCJuYW1lIjoiRGVzZW52b2x2ZWRvciIsInBpY3R1cmUiOiIiLCJzdWIiOiJkZXYtdXNlci0wMDEiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjk5OTk5OTk5OTl9' +
  '.dev-signature'

export const DEV_MOCK_USER = {
  email: 'dev@gis.local',
  name: 'Desenvolvedor',
  picture: '',
  sub: 'dev-user-001',
  role: 'admin' as const,
}

const MOCK_HOSPITALS = [
  { id: 'h-001', name: 'Hospital Center Clínicas',                       cnes: '0014125', logo_url: '/logos/CenterClinicas.png',    period_start: '2021-01-01', period_end: '2025-04-30', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiNjJhZjcyYjAtYzI4Ni00NDVmLWE3NmUtNDk1MjA4YTY4ZmVlIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 1,  created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-002', name: 'Hospital Geral Clériston Andrade',                cnes: '2799758', logo_url: null,                           period_start: '2021-01-01', period_end: '2025-12-31', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiMmQ0ZmFiNGQtZmQ3OC00ZWU5LTk5MjYtYmQyZTU4NzlmOTZhIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 2,  created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-003', name: 'UPAs Florianópolis',                              cnes: '4564812', logo_url: '/logos/Florianopolis.png',      period_start: '2021-01-01', period_end: '2026-01-31', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiMjZlMWJiNGMtZDkyYi00YTQwLWIyYzgtZDFlZGQxOWY3MjgxIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9&pageName=91184a9ff5a9166b63e0', sort_order: 3,  created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-004', name: 'Hospital Nsa. Sra. da Imaculada Conceição',       cnes: '2778831', logo_url: '/logos/NT.png',                period_start: '2021-01-01', period_end: '2024-11-30', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiNDExNGVmOGUtY2FhYS00NWYyLTg4NTctODUyZGVlMDY4ZjIyIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 4,  created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-005', name: 'Hospital do Coração de Cariri',                   cnes: '4010868', logo_url: '/logos/CARIRI.png',             period_start: '2021-01-01', period_end: '2024-08-31', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiNzdhZDIxYTQtN2M0My00MDA0LTg1OGEtZTFkMDMxYmYwMzM4IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 5,  created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-006', name: 'Maternidade Santo Antônio HMSA',                  cnes: '2564238', logo_url: '/logos/hsa.png',               period_start: '2021-01-01', period_end: '2024-08-31', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiNjRmMDM0OTgtNmQ4ZS00YzRhLThjMDAtNzg0ODMwMjFlYjg0IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 6,  created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-007', name: 'Hospital do Idoso Zilda Arns',                    cnes: '6388671', logo_url: '/logos/zilda_arnss.png',        period_start: '2023-01-01', period_end: '2025-12-31', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiYjdlN2UzNjQtZDRiYi00ZGM5LWE0MjItOWQyODg4NjhlMzNlIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 7,  created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-008', name: 'Hospital Municipal Dr. Ricardo de Tadeu Ladeia',  cnes: '7319770', logo_url: null,                           period_start: '2021-01-01', period_end: '2025-12-31', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiMzUyZGU3MTQtMDIzMC00ZWUyLTk5MDYtYTBkOTQyZWM1NjI4IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 8,  created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-009', name: 'Hospital Nsa. Sra. Das Graças',                   cnes: '2232014', logo_url: '/logos/CanoasDasGracas.png',   period_start: '2021-01-01', period_end: '2025-05-31', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiMjE5OWFjOGItMzU2Zi00MDNlLTg2YzMtZmEwZDdmYTQ2YjE0IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 9,  created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-010', name: 'Hospital do Rocio',                               cnes: '0013846', logo_url: null,                           period_start: '2021-01-01', period_end: '2025-12-31', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiN2E0ZDA5OGItNDU5OC00YzU4LTgzZmItNTQ5NjI2ZmI0MGI1IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 10, created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-011', name: 'Hospital do Câncer de Londrina',                  cnes: '2577623', logo_url: '/logos/hcl.png',               period_start: '2021-01-01', period_end: '2024-07-31', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiNjNjMzczYzItMjZlMC00MjliLTgzYTItNDUyZWI1MTFkZjQwIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 11, created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-012', name: 'Hospital São Vicente de Paulo',                   cnes: '2246988', logo_url: null,                           period_start: '2021-01-01', period_end: '2024-07-31', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiYWVjNjdlZDQtOTE3Yy00ZDNhLWE0MDQtNzNhZDcxOWRkOGEzIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 12, created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-013', name: 'Santa Casa de Paranavaí',                        cnes: '2754738', logo_url: null,                           period_start: '2021-01-01', period_end: '2026-02-28', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiYzA5YTc3YWEtNTU4OS00ZTVkLTg1NjItOGQxZjM4NmRhMDQ3IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 13, created_at: '2024-01-01T00:00:00Z' },
  { id: 'h-014', name: 'Hospital Municipal Santa Luzia',                        cnes: '2374366', logo_url: null,                           period_start: '2021-01-01', period_end: '2026-06-30', powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiN2M1M2NjNDQtZTMwYy00YmUyLTgxNjQtYTIwYjg0NDU4MmU2IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9', sort_order: 14, created_at: '2024-01-01T00:00:00Z' },
]

const MOCK_USERS = [
  {
    id: 'dev-user-001',
    email: 'dev@gis.local',
    name: 'Desenvolvedor',
    picture: null,
    role: 'admin' as const,
    hospitals: MOCK_HOSPITALS.slice(0, 3).map(h => ({ id: h.id, name: h.name, cnes: h.cnes })),
  },
  {
    id: 'dev-user-002',
    email: 'gestor@gis.local',
    name: 'Gestor Demo',
    picture: null,
    role: 'manager' as const,
    hospitals: MOCK_HOSPITALS.slice(0, 5).map(h => ({ id: h.id, name: h.name, cnes: h.cnes })),
  },
]

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export function handleDevMock(path: string[], req: NextRequest): NextResponse {
  const method = req.method
  const [seg0, seg1, seg2, seg3] = path

  // GET /hospitals
  if (seg0 === 'hospitals' && !seg1 && method === 'GET') {
    return json(MOCK_HOSPITALS)
  }

  // Auth
  if (seg0 === 'auth') {
    if ((seg1 === 'login' || seg1 === 'login-password') && method === 'POST') {
      return json({ token: DEV_MOCK_JWT, user: DEV_MOCK_USER })
    }
    if (seg1 === 'forgot-password' && method === 'POST') {
      return json({ message: 'Email enviado (modo dev)' })
    }
    if (seg1 === 'reset-password') {
      if (method === 'GET') return json({ email: 'dev@gis.local' })
      if (method === 'POST') return json({ message: 'Senha redefinida (modo dev)' })
    }
  }

  // Invitations
  if (seg0 === 'invitations' && seg1) {
    if (!seg2 && method === 'GET') {
      return json({ email: 'convidado@gis.local', role: 'manager' })
    }
    if ((seg2 === 'accept-google' || seg2 === 'accept-password') && method === 'POST') {
      return json({ token: DEV_MOCK_JWT, user: DEV_MOCK_USER })
    }
  }

  // Admin: users
  if (seg0 === 'admin' && seg1 === 'users') {
    if (!seg2) {
      if (method === 'GET') return json(MOCK_USERS)
      if (method === 'POST') {
        return json({
          id: `dev-user-new`,
          email: 'novo@gis.local',
          name: null,
          invitation_token: 'dev-invite-token-123',
        }, 201)
      }
    }
    if (seg2) {
      if (!seg3 && method === 'DELETE') return json({})
      if (seg3 === 'invitations' && method === 'POST') {
        return json({ invitation_token: 'dev-invite-token-456' })
      }
      if (seg3 === 'hospitals' && method === 'PUT') return json({})
    }
  }

  return json({ error: `[DEV] Rota não mapeada: ${method} /${path.join('/')}` }, 404)
}
