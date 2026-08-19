import { API_BASE_URL } from './config'

export interface AuthCredentials {
  username: string
  password: string
}

export class AuthApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
  }
}

type BackendErrorBody = {
  message?: unknown
  error?: unknown
  title?: unknown
  errors?: Record<string, string[]> | string[]
}

export type TokenPair = {
  accessToken: string
  refreshToken: string
}

async function getErrorMessage(response: Response): Promise<string> {
  const fallback = `Request failed with status ${response.status}`

  let text: string
  try {
    text = await response.text()
  } catch {
    return fallback
  }

  if (!text) return fallback

  try {
    const body = JSON.parse(text) as BackendErrorBody

    const direct = [body.message, body.error, body.title].find(
      (value): value is string =>
        typeof value === 'string' && value.trim().length > 0,
    )
    if (direct) return direct

    if (body.errors) {
      const values = Array.isArray(body.errors)
        ? body.errors
        : Object.values(body.errors)
      const flattened = values
        .flat()
        .filter((value): value is string => typeof value === 'string')
      if (flattened.length > 0) return flattened.join(', ')
    }
  } catch {
    // The body is not JSON
  }

  const trimmed = text.trim()
  return trimmed.length <= 200 ? trimmed : fallback
}

async function postJson(path: string, body: unknown): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new AuthApiError(response.status, await getErrorMessage(response))
  }

  if (response.status === 204) return null

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

function parseTokenPair(data: unknown): TokenPair {
  const body = (data ?? {}) as Partial<TokenPair>

  if (!body.accessToken || !body.refreshToken) {
    throw new AuthApiError(502, 'The backend did not return auth tokens')
  }

  return { accessToken: body.accessToken, refreshToken: body.refreshToken }
}

export async function loginOnBackend(
  credentials: AuthCredentials,
): Promise<TokenPair> {
  const data = await postJson('/api/auth/login', credentials)
  return parseTokenPair(data)
}

export async function registerOnBackend(
  credentials: AuthCredentials,
): Promise<TokenPair> {
  const data = await postJson('/api/auth/register', credentials)
  return parseTokenPair(data)
}

export async function refreshOnBackend(
  refreshToken: string,
): Promise<TokenPair> {
  const data = await postJson('/api/auth/refresh', { refreshToken })
  return parseTokenPair(data)
}

export async function logoutOnBackend(refreshToken: string): Promise<void> {
  await postJson('/api/auth/logout', { refreshToken })
}
