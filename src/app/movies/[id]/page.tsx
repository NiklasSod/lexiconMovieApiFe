import { getMovieWithDetail } from '@/services/movies'
import MovieDetail from '@/components/movie/MovieDetail'
import type { MovieWithDetail } from '@/types/movie'
import styles from './page.module.scss'

type MovieDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { id } = await params
  const movieId = Number.parseInt(id, 10)

  if (!Number.isInteger(movieId) || movieId < 1) {
    return (
      <main className={styles.main}>
        <p className={styles.error}>Movie not found.</p>
      </main>
    )
  }

  let movie: MovieWithDetail | null = null

  try {
    movie = await getMovieWithDetail(movieId)
  } catch (error) {
    console.error(`Failed to load movie ${movieId}`, error)
  }

  if (!movie) {
    return (
      <main className={styles.main}>
        <p className={styles.error}>Could not load the movie.</p>
      </main>
    )
  }

  return (
    <main>
      <MovieDetail movie={movie} />
    </main>
  )
}
