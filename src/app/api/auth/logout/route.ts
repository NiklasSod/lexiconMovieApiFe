import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logoutOnBackend } from '@/services/auth'
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@/services/authCookies'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value

  if (refreshToken) {
    try {
      await logoutOnBackend(refreshToken)
    } catch (error) {
      // Best effort: still clear local cookies even if the backend call fails.
      console.error('Backend logout failed', error)
    }
  }

  cookieStore.delete(ACCESS_TOKEN_COOKIE)
  cookieStore.delete(REFRESH_TOKEN_COOKIE)

  return NextResponse.json({ ok: true })
}
