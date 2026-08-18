import { Suspense } from 'react'
import { MovieSortDropdown } from '@/components/movie/MovieSortDropdown'
import { MoviesExplorer } from '@/components/movie/MoviesExplorer'
import { getMovieSort } from '@/utils/movie'
import styles from './page.module.scss'

type MoviesPageProps = {
  searchParams: Promise<{ sort?: string; page?: string }>
}

const MoviesPage = async ({ searchParams }: MoviesPageProps) => {
  const { sort, page } = await searchParams
  const currentSort = getMovieSort(sort)

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

      <MoviesExplorer sort={currentSort.value} page={page} />
    </main>
  )
}

export default MoviesPage
