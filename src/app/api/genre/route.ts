import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_BASE_URL } from '@/services/config'
import { ACCESS_TOKEN_COOKIE } from '@/services/authCookies'
import { getGenresServer } from '@/services/genres'

export async function GET() {
  try {
    const genres = await getGenresServer()
    return NextResponse.json(genres)
  } catch (error) {
    console.error('Failed to fetch genres', error)
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 502 },
    )
  }
}

function extractErrorMessage(body: unknown): string | null {
  if (typeof body === 'string' && body.trim()) return body.trim()

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
      { message: 'You must be signed in to add a genre' },
      { status: 401 },
    )
  }

  let name: string
  try {
    const body = (await request.json()) as { Name?: unknown; name?: unknown }
    const raw = typeof body.Name === 'string' ? body.Name : body.name
    name = typeof raw === 'string' ? raw.trim() : ''
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  if (!name) {
    return NextResponse.json(
      { message: 'Genre name is required' },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/genre`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ Name: name }),
    })

    const data = (await response.json().catch(() => null)) as unknown

    if (!response.ok) {
      return NextResponse.json(
        { message: extractErrorMessage(data) ?? 'Failed to create genre' },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to create genre', error)
    return NextResponse.json(
      { message: 'Failed to create genre' },
      { status: 502 },
    )
  }
}
