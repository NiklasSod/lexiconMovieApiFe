import MovieCard from '@/components/movie/MovieCard'
import { getMovies, getMovieWithDetail } from '@/services/movies'
import type { MovieWithDetail } from '@/types/movie'
import { averageRating } from '@/utils/movie'
import styles from './page.module.scss'

const MAX_MOVIES = 10

const MoviesPage = async () => {
  let movies: MovieWithDetail[] = []

  try {
    const all = await getMovies()

    const details = await Promise.all(
      all.map(async (movie) => {
        try {
          return await getMovieWithDetail(movie.id)
        } catch (error) {
          console.error(`Failed to load movie ${movie.id}`, error)
          return null
        }
      }),
    )

    movies = details
      .filter((movie): movie is MovieWithDetail => movie !== null)
      .sort((a, b) => averageRating(b) - averageRating(a))
      .slice(0, MAX_MOVIES)
  } catch (error) {
    console.error('Failed to load movies', error)
  }

  return (
    <main className={styles.main}>
      <header className={styles.heading}>
        <p className={styles.kicker}>Browse</p>
        <h1 className={styles.title}>Movies</h1>
        <p className={styles.subtitle}>Ranked by top user reviews</p>
      </header>

      {movies.length > 0 ? (
        <div className={styles.grid}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className={styles.error}>Could not load movies.</p>
      )}
    </main>
  )
}

export default MoviesPage
