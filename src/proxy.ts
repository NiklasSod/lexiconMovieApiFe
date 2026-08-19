import { NextRequest, NextResponse } from 'next/server'
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@/services/authCookies'

const REFRESH_WINDOW_SECONDS = 60

function getJwtExpiry(token: string): number | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64)) as { exp?: number }
    return typeof payload.exp === 'number' ? payload.exp : null
  } catch {
    return null
  }
}

function needsRefresh(accessToken: string | undefined): boolean {
  if (!accessToken) return true

  const expiry = getJwtExpiry(accessToken)
  if (expiry === null) return true

  return expiry - Math.floor(Date.now() / 1000) < REFRESH_WINDOW_SECONDS
}

function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {}
  if (!header) return cookies

  for (const part of header.split(';')) {
    const separator = part.indexOf('=')
    if (separator === -1) continue
    const name = part.slice(0, separator).trim()
    const value = part.slice(separator + 1).trim()
    if (name) cookies[name] = value
  }

  return cookies
}

function serializeCookies(cookies: Record<string, string>): string {
  return Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ')
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value

  if (!refreshToken || !needsRefresh(accessToken)) {
    return NextResponse.next()
  }

  try {
    const refreshResponse = await fetch(
      new URL('/api/auth/refresh', request.url),
      {
        method: 'POST',
        headers: { cookie: request.headers.get('cookie') ?? '' },
      },
    )

    if (!refreshResponse.ok) {
      return NextResponse.next()
    }

    const requestCookies = parseCookies(request.headers.get('cookie'))
    for (const setCookie of refreshResponse.headers.getSetCookie()) {
      const [pair] = setCookie.split(';')
      const separator = pair.indexOf('=')
      if (separator === -1) continue

      const name = pair.slice(0, separator).trim()
      const value = pair.slice(separator + 1).trim()
      if (name) requestCookies[name] = value
    }

    const nextHeaders = new Headers(request.headers)
    nextHeaders.set('cookie', serializeCookies(requestCookies))

    const response = NextResponse.next({ request: { headers: nextHeaders } })

    // Persist the rotated cookies in the browser.
    for (const setCookie of refreshResponse.headers.getSetCookie()) {
      response.headers.append('set-cookie', setCookie)
    }

    return response
  } catch (error) {
    console.error('Token refresh failed in middleware', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
