'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import MovieCard from './MovieCard'
import { Pagination } from './Pagination'
import { getMoviesClient, getMovieWithDetailClient } from '@/services/movies'
import type { MovieWithDetail } from '@/types/movie'
import { type MovieSortKey, sortMovies } from '@/utils/movie'
import styles from '../../app/movies/page.module.scss'

const MAX_MOVIES = 20
const PAGE_SIZE = 4

type MoviesExplorerProps = {
  sort: MovieSortKey
  page?: string
}

export const MoviesExplorer = ({ sort, page }: MoviesExplorerProps) => {
  const [movies, setMovies] = useState<MovieWithDetail[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const allMovies = await getMoviesClient()

        const details = await Promise.all(
          allMovies.map(async (movie) => {
            try {
              return await getMovieWithDetailClient(movie.id)
            } catch (error) {
              console.error(`Failed to load movie ${movie.id}`, error)
              return null
            }
          }),
        )

        if (!cancelled) {
          setMovies(
            details.filter((movie): movie is MovieWithDetail => movie !== null),
          )
        }
      } catch (error) {
        console.error('Failed to load movies', error)
        if (!cancelled) setFailed(true)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const sorted = useMemo(
    () => (movies ? sortMovies(movies, sort).slice(0, MAX_MOVIES) : []),
    [movies, sort],
  )

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const requestedPage = Number.parseInt(page ?? '1', 10)
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1
  const pageMovies = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  if (failed) {
    return <p className={styles.error}>Could not load movies.</p>
  }

  if (!movies) {
    return <p className={styles.loading}>Loading movies…</p>
  }

  if (movies.length === 0) {
    return <p className={styles.error}>Could not load movies.</p>
  }

  return (
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
  )
}
