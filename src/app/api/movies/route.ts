import { NextResponse } from 'next/server'
import { getMovies } from '@/services/movies'

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
