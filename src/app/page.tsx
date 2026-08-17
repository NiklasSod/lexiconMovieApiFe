import FeaturedMovie from '@/components/movie/FeaturedMovie'
import { getMovieWithDetail } from '@/services/movies'
import type { MovieWithDetail } from '@/types/movie'
import styles from './page.module.scss'

export default async function Home() {
  let movie: MovieWithDetail | null = null

  try {
    movie = await getMovieWithDetail(1)
  } catch (error) {
    console.error('Failed to load the highlighted movie', error)
  }

  return (
    <>
      <main>
        {movie ? (
          <FeaturedMovie movie={movie} />
        ) : (
          <p className={styles.error}>Could not load the highlighted movie.</p>
        )}
      </main>
    </>
  )
}
