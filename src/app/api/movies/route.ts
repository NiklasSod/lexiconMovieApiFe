import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getMovies } from '@/services/movies'
import { API_BASE_URL } from '@/services/config'
import { ACCESS_TOKEN_COOKIE } from '@/services/authCookies'
import type { MovieCreateInput } from '@/types/movie'

export async function GET() {
  try {
    const movies = await getMovies()
    return NextResponse.json(movies)
  } catch (error) {
    console.error('Failed to fetch movies', error)
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 502 },
    )
  }
}

function extractErrorMessage(body: unknown): string | null {
  const data = body as {
    message?: unknown
    title?: unknown
    errors?: Record<string, string[]> | string[]
  }

  const direct = [data.message, data.title].find(
    (value): value is string =>
      typeof value === 'string' && value.trim().length > 0,
  )
  if (direct) return direct

  if (data.errors) {
    const values = Array.isArray(data.errors)
      ? data.errors
      : Object.values(data.errors)
    const messages = values
      .flat()
      .filter((value): value is string => typeof value === 'string')
    if (messages.length > 0) return messages.join(' ')
  }

  return null
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json(
      { message: 'You must be signed in to add a movie' },
      { status: 401 },
    )
  }

  let body: MovieCreateInput
  try {
    body = (await request.json()) as MovieCreateInput
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    const data = (await response.json().catch(() => null)) as unknown

    if (!response.ok) {
      return NextResponse.json(
        { message: extractErrorMessage(data) ?? 'Failed to create movie' },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to create movie', error)
    return NextResponse.json(
      { message: 'Failed to create movie' },
      { status: 502 },
    )
  }
}
