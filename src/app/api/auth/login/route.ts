import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AuthApiError, loginOnBackend } from '@/services/auth'
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from '@/services/authCookies'

export async function POST(request: Request) {
  let username: string
  let password: string

  try {
    const body = (await request.json()) as {
      username?: unknown
      password?: unknown
    }
    username = typeof body.username === 'string' ? body.username.trim() : ''
    password = typeof body.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  if (!username || !password) {
    return NextResponse.json(
      { message: 'Username and password are required' },
      { status: 400 },
    )
  }

  try {
    const { accessToken, refreshToken } = await loginOnBackend({
      username,
      password,
    })

    const cookieStore = await cookies()
    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
    })
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof AuthApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      )
    }

    console.error('Login failed', error)
    return NextResponse.json({ message: 'Login failed' }, { status: 502 })
  }
}
