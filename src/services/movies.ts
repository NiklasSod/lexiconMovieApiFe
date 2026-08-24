import { apiFetch, clientFetch } from '../utils/fetchWrapper'
import type { Movie, MovieCreateInput, MovieWithDetail } from '../types/movie'

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

export function createMovie(input: MovieCreateInput): Promise<Movie> {
  return fetch('/api/movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).then(async (response) => {
    const data = (await response.json().catch(() => ({}))) as {
      message?: string
    }

    if (!response.ok) {
      throw new Error(data.message ?? 'Could not create movie')
    }

    return data as Movie
  })
}
