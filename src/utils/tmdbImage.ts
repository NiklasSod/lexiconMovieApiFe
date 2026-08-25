/**
 * TMDB poster URL helpers.
 * TMDB serves poster images at URLs shaped like:
 * https://image.tmdb.org/t/p/w600_and_h900_face/<file>.webp
 */

export const TMDB_IMAGE_PATH = 'image.tmdb.org/t/p/w600_and_h900_face'

export const isTmdbImageUrl = (url: string): boolean =>
  url.toLowerCase().includes(TMDB_IMAGE_PATH)

export const isWebpUrl = (url: string): boolean =>
  /\.webp(\?|#|$)/i.test(url.trim())
