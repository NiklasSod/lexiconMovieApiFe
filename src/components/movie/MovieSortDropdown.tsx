'use client'

import { type ChangeEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MOVIE_SORT_OPTIONS, type MovieSortKey } from '@/utils/movie'
import styles from './MovieSortDropdown.module.scss'

export const MovieSortDropdown = ({ value }: { value: MovieSortKey }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as MovieSortKey
    const params = new URLSearchParams(searchParams.toString())

    if (next === 'rating') {
      params.delete('sort')
    } else {
      params.set('sort', next)
    }

    // Change sort reset the list to first page
    params.delete('page')

    const query = params.toString()
    router.replace(query ? `/movies?${query}` : '/movies', { scroll: false })
  }

  return (
    <div className={styles.wrapper}>
      <label htmlFor="movie-sort" className={styles.labelText}>
        Sort by
      </label>
      <select
        id="movie-sort"
        key={value}
        defaultValue={value}
        onChange={handleChange}
        className={styles.select}
      >
        {MOVIE_SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
