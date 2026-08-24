import { apiFetch } from '@/utils/fetchWrapper'
import type { Genre } from '../types/movie'

export async function createGenre(name: string): Promise<Genre> {
  return await fetch('/api/genre', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Name: name }),
  }).then(async (response) => {
    const data = (await response.json().catch(() => ({}))) as {
      message?: string
      id?: number
      name?: string
    }

    if (!response.ok) {
      throw new Error(data.message ?? 'Could not create genre')
    }

    return { id: data.id ?? 0, name: data.name ?? name }
  })
}

export function getGenres(): Promise<Genre[]> {
  return apiFetch<Genre[]>('/api/genre', {
    cache: 'no-store',
  })
}
