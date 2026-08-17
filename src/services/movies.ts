import { apiFetch } from '../utils/fetchWrapper'
import type { MovieWithDetail } from '../types/movie'

export function getMovieWithDetail(id: number): Promise<MovieWithDetail> {
  return apiFetch<MovieWithDetail>(`/api/movies/withdetail/${id}`, {
    cache: 'no-store',
  })
}
