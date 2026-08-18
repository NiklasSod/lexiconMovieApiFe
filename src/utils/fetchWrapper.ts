import { API_BASE_URL } from '../services/config'

export { API_BASE_URL }

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
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

export function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return request<T>(`${API_BASE_URL}${path}`, init)
}

export function clientFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return request<T>(path, init)
}
