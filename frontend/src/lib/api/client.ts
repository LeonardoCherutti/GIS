export type Result<T, E = ApiError> =
  | { ok: true; data: T }
  | { ok: false; error: E }

export interface ApiError {
  status: number
  message: string
  code?: string
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<Result<T>> {
  try {
    const { token: _token, ...fetchOptions } = options ?? {}
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    const res = await fetch(
      `/api/proxy${path.startsWith('/api') ? path.slice(4) : path}`,
      { ...fetchOptions, headers: { ...headers, ...fetchOptions.headers as Record<string, string> } }
    )
    if (!res.ok) {
      if (res.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('gis_auth_token')
        await fetch('/api/session', { method: 'DELETE' })
        window.location.href = '/'
      }
      const body = await res.json().catch(() => ({}))
      return {
        ok: false,
        error: {
          status: res.status,
          message: body.error ?? 'Erro desconhecido',
          code: body.code,
        },
      }
    }
    const data: T = await res.json()
    return { ok: true, data }
  } catch {
    return {
      ok: false,
      error: {
        status: 0,
        message: 'Sem conexao. Verifique sua internet e tente novamente.',
      },
    }
  }
}
