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
