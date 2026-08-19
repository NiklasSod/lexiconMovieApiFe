import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  AuthApiError,
  loginOnBackend,
  registerOnBackend,
} from '@/services/auth'

const AUTH_COOKIE_NAME = 'auth_token'

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

  if (password.length < 6) {
    return NextResponse.json(
      { message: 'Password must be at least 6 characters long' },
      { status: 400 },
    )
  }

  try {
    await registerOnBackend({ username, password })

    // Register on its own does not return a token, so sign the new user in
    // straight away by calling the login endpoint.
    const token = await loginOnBackend({ username, password })

    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    if (error instanceof AuthApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      )
    }

    console.error('Register failed', error)
    return NextResponse.json({ message: 'Register failed' }, { status: 502 })
  }
}
