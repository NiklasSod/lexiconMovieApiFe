export const DEVELOPMENT_API_URL = 'https://localhost:7298'
export const PRODUCTION_API_URL =
  'https://lexiconmovieapi-production.up.railway.app'

export const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.env.VERCEL_ENV === 'production' ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (isProduction ? PRODUCTION_API_URL : DEVELOPMENT_API_URL)
