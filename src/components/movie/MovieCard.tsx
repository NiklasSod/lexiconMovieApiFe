import Link from 'next/link'
import Image from 'next/image'
import type { MovieWithDetail } from '@/types/movie'
import FilmIcon from '../icons/FilmIcon'
import Stars from '../stars/Stars'
import { averageRating, formatDuration } from '../../utils/movie'
import styles from './MovieCard.module.scss'

const MovieCard = ({ movie }: { movie: MovieWithDetail }) => {
  const rating = averageRating(movie)
  const hasImage = movie.image.length > 0

  return (
    <Link
      href={`/movies/${movie.id}`}
      className={styles.card}
      aria-label={`View details for ${movie.title}`}
    >
      <div className={styles.poster}>
        {hasImage ? (
          <Image
            src={movie.image}
            alt={`${movie.title} poster`}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className={styles.posterImage}
          />
        ) : (
          <div className={styles.placeholder}>
            <FilmIcon className={styles.placeholderIcon} />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{movie.title}</h2>
          <span className={styles.genreBadge}>{movie.genreName}</span>
        </div>

        <p className={styles.meta}>
          {movie.year} · {formatDuration(movie.duration)}
        </p>

        <p className={styles.synopsis}>
          {movie.detail?.synopsis ?? 'No synopsis available.'}
        </p>

        <div className={styles.footer}>
          {rating > 0 ? (
            <span className={styles.rating}>
              <Stars rating={Math.round(rating)} />
              <span>{rating.toFixed(1)}</span>
            </span>
          ) : (
            <span className={styles.noRating}>No reviews yet</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
