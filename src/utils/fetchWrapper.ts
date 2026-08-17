import { API_BASE_URL } from '../services/config'

export { API_BASE_URL }

/**
 * Minimal fetch wrapper targeting the configured API base URL.
 * Use it for all requests to the movie API.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    )
  }

  return (await response.json()) as T
}
