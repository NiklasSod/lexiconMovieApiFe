import type { MovieWithDetail } from '../types/movie'

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

export const averageRating = (movie: MovieWithDetail) =>
  movie.reviews.length > 0
    ? movie.reviews.reduce((sum, review) => sum + review.rating, 0) /
      movie.reviews.length
    : 0

export type MovieSortKey =
  'rating' | 'oldest' | 'latest' | 'longest' | 'shortest'

export interface MovieSortOption {
  value: MovieSortKey
  label: string
  subtitle: string
}

export const MOVIE_SORT_OPTIONS: MovieSortOption[] = [
  {
    value: 'rating',
    label: 'User reviews',
    subtitle: 'Ranked by top user reviews',
  },
  {
    value: 'oldest',
    label: 'Oldest',
    subtitle: 'Oldest movies first',
  },
  {
    value: 'latest',
    label: 'Latest',
    subtitle: 'Latest movies first',
  },
  {
    value: 'longest',
    label: 'Longest',
    subtitle: 'Longest movies first',
  },
  {
    value: 'shortest',
    label: 'Shortest',
    subtitle: 'Shortest movies first',
  },
]

export const getMovieSort = (key: string | undefined): MovieSortOption =>
  MOVIE_SORT_OPTIONS.find((option) => option.value === key) ??
  MOVIE_SORT_OPTIONS[0]

export const sortMovies = (
  movies: MovieWithDetail[],
  key: MovieSortKey,
): MovieWithDetail[] => {
  const sorted = [...movies]

  switch (key) {
    case 'oldest':
      return sorted.sort((a, b) => a.year - b.year)
    case 'latest':
      return sorted.sort((a, b) => b.year - a.year)
    case 'longest':
      return sorted.sort((a, b) => b.duration - a.duration)
    case 'shortest':
      return sorted.sort((a, b) => a.duration - b.duration)
    case 'rating':
    default:
      return sorted.sort((a, b) => averageRating(b) - averageRating(a))
  }
}
