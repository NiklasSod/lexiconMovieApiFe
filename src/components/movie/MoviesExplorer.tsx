'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import MovieCard from './MovieCard'
import { Pagination } from './Pagination'
import { getMoviesClient, getMovieWithDetailClient } from '@/services/movies'
import type { MovieWithDetail } from '@/types/movie'
import { type MovieSortKey, sortMovies } from '@/utils/movie'
import styles from '../../app/movies/page.module.scss'

const MAX_MOVIES = 20
const PAGE_SIZE = 4

async function fetchMovies(): Promise<MovieWithDetail[]> {
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

  return details.filter((movie): movie is MovieWithDetail => movie !== null)
}

type MoviesExplorerProps = {
  sort: MovieSortKey
  page?: string
}

export const MoviesExplorer = ({ sort, page }: MoviesExplorerProps) => {
  const [movies, setMovies] = useState<MovieWithDetail[] | null>(null)
  const [failed, setFailed] = useState(false)

  const refresh = useCallback(async () => {
    try {
      setMovies(await fetchMovies())
      setFailed(false)
    } catch (error) {
      console.error('Failed to load movies', error)
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const start = async () => {
      try {
        const result = await fetchMovies()
        if (!cancelled) {
          setMovies(result)
          setFailed(false)
        }
      } catch (error) {
        console.error('Failed to load movies', error)
        if (!cancelled) setFailed(true)
      }
    }

    start()

    const handleMoviesUpdated = () => {
      if (!cancelled) refresh()
    }

    window.addEventListener('movies-updated', handleMoviesUpdated)

    return () => {
      cancelled = true
      window.removeEventListener('movies-updated', handleMoviesUpdated)
    }
  }, [refresh])

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
    return (
      <p className={styles.error}>
        Could not load movies. The database might sleep! Try again in 30
        seconds.
      </p>
    )
  }

  if (!movies) {
    return <p className={styles.loading}>Loading movies…</p>
  }

  if (movies.length === 0) {
    return (
      <p className={styles.error}>
        Could not load movies. The database might sleep! Try again in 30
        seconds.
      </p>
    )
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
