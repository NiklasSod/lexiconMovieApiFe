import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { put } from '@vercel/blob'
import { ACCESS_TOKEN_COOKIE } from '@/services/authCookies'
import { isTmdbImageUrl, isWebpUrl } from '@/utils/tmdbImage'

const MAX_IMAGE_BYTES = 0.5 * 1024 * 1024 // 0.5 MB

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json(
      { message: 'You must be signed in to upload an image' },
      { status: 401 },
    )
  }

  let url: string
  try {
    const body = (await request.json()) as { url?: unknown }
    url = typeof body.url === 'string' ? body.url.trim() : ''
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  if (!url) {
    return NextResponse.json(
      { message: 'Image URL is required' },
      { status: 400 },
    )
  }

  if (!isTmdbImageUrl(url)) {
    return NextResponse.json(
      {
        message:
          'Only TMDB poster URLs are supported (image.tmdb.org/t/p/w600_and_h900_face)',
      },
      { status: 400 },
    )
  }

  if (!isWebpUrl(url)) {
    return NextResponse.json(
      { message: 'TMDB images must be in .webp format' },
      { status: 400 },
    )
  }

  try {
    const imageResponse = await fetch(url, { cache: 'no-store' })
    if (!imageResponse.ok) {
      return NextResponse.json(
        { message: 'Could not download the image from TMDB' },
        { status: 502 },
      )
    }

    const contentLength = Number(
      imageResponse.headers.get('content-length') ?? 0,
    )
    if (contentLength > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { message: 'Image is larger than 0.5 MB' },
        { status: 400 },
      )
    }

    const data = await imageResponse.arrayBuffer()

    const fileName =
      new URL(url).pathname.split('/').filter(Boolean).pop() ?? 'poster.webp'
    const pathname = `posters/${fileName}`

    const blob = await put(pathname, data, {
      access: 'public',
      contentType: 'image/webp',
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Failed to upload image to blob store', error)
    return NextResponse.json(
      { message: 'Failed to upload image' },
      { status: 502 },
    )
  }
}
