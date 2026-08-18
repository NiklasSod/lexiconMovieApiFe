import { NextResponse } from 'next/server'
import { getMovieWithDetail } from '@/services/movies'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params
  const movieId = Number.parseInt(id, 10)

  if (!Number.isInteger(movieId) || movieId < 1) {
    return NextResponse.json({ error: 'Invalid movie id' }, { status: 400 })
  }

  try {
    const movie = await getMovieWithDetail(movieId)
    return NextResponse.json(movie)
  } catch (error) {
    console.error(`Failed to fetch movie ${movieId}`, error)
    return NextResponse.json(
      { error: 'Failed to fetch movie' },
      { status: 502 },
    )
  }
}
