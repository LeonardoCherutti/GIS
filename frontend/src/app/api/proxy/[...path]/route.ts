import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://api:8080'

function extractEmailFromJwt(token: string): string | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'))
    return payload.email ?? null
  } catch {
    return null
  }
}

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const target = `${API_URL}/api/${path.join('/')}${req.nextUrl.search}`

  const cookieStore = await cookies()
  const session = cookieStore.get('auth-session')?.value

  const contentType = req.headers.get('content-type') ?? 'application/json'
  const headers: Record<string, string> = {
    'Content-Type': contentType,
  }
  if (session) {
    headers['Authorization'] = `Bearer ${session}`
    const email = extractEmailFromJwt(session)
    if (email) {
      headers['X-User-Email'] = email
    }
  }

  const res = await fetch(target, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.arrayBuffer() : undefined,
    signal: AbortSignal.timeout(120_000),
  })

  const data = await res.arrayBuffer()
  const responseHeaders: Record<string, string> = {
    'Content-Type': res.headers.get('content-type') ?? 'application/json',
  }

  const response = new NextResponse(data, {
    status: res.status,
    headers: responseHeaders,
  })

  const setCookies = res.headers.getSetCookie()
  for (const cookie of setCookies) {
    response.headers.append('Set-Cookie', cookie)
  }

  return response
}

export const maxDuration = 120

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
