import { Suspense } from 'react'
import MovieCard from '@/components/movie/MovieCard'
import { MovieSortDropdown } from '@/components/movie/MovieSortDropdown'
import { getMovies, getMovieWithDetail } from '@/services/movies'
import type { MovieWithDetail } from '@/types/movie'
import { getMovieSort, sortMovies } from '@/utils/movie'
import styles from './page.module.scss'

const MAX_MOVIES = 10

type MoviesPageProps = {
  searchParams: Promise<{ sort?: string }>
}

const MoviesPage = async ({ searchParams }: MoviesPageProps) => {
  const { sort } = await searchParams
  const currentSort = getMovieSort(sort)

  let movies: MovieWithDetail[] = []

  try {
    const allMovies = await getMovies()

    const details = await Promise.all(
      allMovies.map(async (movie) => {
        try {
          return await getMovieWithDetail(movie.id)
        } catch (error) {
          console.error(`Failed to load movie ${movie.id}`, error)
          return null
        }
      }),
    )

    movies = sortMovies(
      details.filter((movie): movie is MovieWithDetail => movie !== null),
      currentSort.value,
    ).slice(0, MAX_MOVIES)
  } catch (error) {
    console.error('Failed to load movies', error)
  }

  return (
    <main className={styles.main}>
      <div className={styles.mainHeader}>
        <header className={styles.heading}>
          <p className={styles.kicker}>Browse</p>
          <h1 className={styles.title}>Movies</h1>
          <p className={styles.subtitle}>{currentSort.subtitle}</p>
        </header>

        <Suspense fallback={null}>
          <MovieSortDropdown value={currentSort.value} />
        </Suspense>
      </div>

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
