import { apiFetch, clientFetch } from '../utils/fetchWrapper'
import type { Movie, MovieWithDetail } from '../types/movie'

export function getMovies(): Promise<Movie[]> {
  return apiFetch<Movie[]>('/api/movies', {
    cache: 'no-store',
  })
}

export function getMovieWithDetail(id: number): Promise<MovieWithDetail> {
  return apiFetch<MovieWithDetail>(`/api/movies/withdetail/${id}`, {
    cache: 'no-store',
  })
}

export function getMoviesClient(): Promise<Movie[]> {
  return clientFetch<Movie[]>('/api/movies', {
    cache: 'no-store',
  })
}

export function getMovieWithDetailClient(id: number): Promise<MovieWithDetail> {
  return clientFetch<MovieWithDetail>(`/api/movies/withdetail/${id}`, {
    cache: 'no-store',
  })
}
