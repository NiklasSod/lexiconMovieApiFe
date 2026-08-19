import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AuthApiError, refreshOnBackend } from '@/services/auth'
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from '@/services/authCookies'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value

  if (!refreshToken) {
    return NextResponse.json(
      { message: 'Refresh token is required' },
      { status: 401 },
    )
  }

  try {
    const tokens = await refreshOnBackend(refreshToken)

    cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
    })
    cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof AuthApiError) {
      cookieStore.delete(REFRESH_TOKEN_COOKIE)
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      )
    }

    console.error('Token refresh failed', error)
    return NextResponse.json(
      { message: 'Token refresh failed' },
      { status: 502 },
    )
  }
}
