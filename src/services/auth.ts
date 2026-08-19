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

type LoginResponse = {
  token?: string
}

/**
 * Tries to extract a human readable message from the C# backend error body.
 * The backend contract for auth errors is not finalised yet, so we accept a
 * few common shapes (message / error / title / validation errors) and fall
 * back to the status text.
 */
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
    // The body is not JSON — fall back to using it as plain text below.
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

/**
 * Calls the C# backend login endpoint.
 *
 * NOTE: The backend auth endpoints are not fully implemented yet. This expects
 * POST /api/auth/login to accept `{ username, password }` and return
 * `{ token: string }`.
 */
export async function loginOnBackend(
  credentials: AuthCredentials,
): Promise<string> {
  const data = (await postJson(
    '/api/auth/login',
    credentials,
  )) as LoginResponse | null

  const token = data?.token
  if (!token) {
    throw new AuthApiError(502, 'The backend did not return an auth token')
  }

  return token
}

/**
 * Calls the C# backend register endpoint.
 *
 * NOTE: The backend auth endpoints are not fully implemented yet. This expects
 * POST /api/auth/register to accept `{ username, password }`. The returned body
 * is ignored — the BFF logs the user in right after registering.
 */
export async function registerOnBackend(
  credentials: AuthCredentials,
): Promise<void> {
  await postJson('/api/auth/register', credentials)
}
