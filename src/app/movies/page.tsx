import { Suspense } from 'react'
import MovieCard from '@/components/movie/MovieCard'
import { MovieSortDropdown } from '@/components/movie/MovieSortDropdown'
import { Pagination } from '@/components/movie/Pagination'
import { getMovies, getMovieWithDetail } from '@/services/movies'
import type { MovieWithDetail } from '@/types/movie'
import { getMovieSort, sortMovies } from '@/utils/movie'
import styles from './page.module.scss'

const MAX_MOVIES = 20
const PAGE_SIZE = 4

type MoviesPageProps = {
  searchParams: Promise<{ sort?: string; page?: string }>
}

const MoviesPage = async ({ searchParams }: MoviesPageProps) => {
  const { sort, page } = await searchParams
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

  const totalPages = Math.max(1, Math.ceil(movies.length / PAGE_SIZE))
  const requestedPage = Number.parseInt(page ?? '1', 10)
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1
  const pageMovies = movies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

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
        <>
          <div className={styles.grid}>
            {pageMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <Suspense fallback={null}>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </Suspense>
        </>
      ) : (
        <p className={styles.error}>Could not load movies.</p>
      )}
    </main>
  )
}

export default MoviesPage
