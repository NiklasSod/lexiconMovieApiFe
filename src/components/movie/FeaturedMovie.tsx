import Image from 'next/image'
import type { MovieWithDetail } from '@/types/movie'
import styles from './FeaturedMovie.module.scss'
import { isProduction } from '../../services/config'

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          aria-hidden="true"
          className={star <= rating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </span>
  )
}

export default function FeaturedMovie({ movie }: { movie: MovieWithDetail }) {
  const reviewCount = movie.reviews.length
  const averageRating =
    reviewCount > 0
      ? movie.reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviewCount
      : 0

  return (
    <section className={styles.section}>
      <header className={styles.heading}>
        <p className={styles.kicker}>Featured</p>
        <h2 className={styles.title}>Highlighted movie of the month</h2>
      </header>

      <article className={styles.card}>
        <div className={styles.poster}>
          <Image
            src={
              isProduction
                ? movie.image
                : // Hardcoded in dev mode for now
                  'https://rjbwyylsoikav7dr.public.blob.vercel-storage.com/matrix-1999.webp'
            }
            alt={`${movie.title} poster`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 380px"
            className={styles.posterImage}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <h1 className={styles.movieTitle}>{movie.title}</h1>
            <span className={styles.genreBadge}>{movie.genreName}</span>
          </div>

          <p className={styles.meta}>
            {movie.year} · {formatDuration(movie.duration)}
          </p>

          <p className={styles.synopsis}>{movie.detail.synopsis}</p>

          <dl className={styles.infoList}>
            <div className={styles.infoItem}>
              <dt>Director</dt>
              <dd>{movie.detail.director}</dd>
            </div>
            <div className={styles.infoItem}>
              <dt>Language</dt>
              <dd>
                {movie.detail.language.length > 0
                  ? movie.detail.language
                  : 'English'}
              </dd>
            </div>
          </dl>

          {averageRating > 0 && (
            <div className={styles.ratingSummary}>
              <Stars rating={Math.round(averageRating)} />
              <span className={styles.ratingValue}>
                {averageRating.toFixed(1)} · {reviewCount} review
                {reviewCount === 1 ? '' : 's'}
              </span>
            </div>
          )}
        </div>
      </article>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <h3 className={styles.panelTitle}>Cast</h3>
          <ul className={styles.castList}>
            {movie.actors.map((actor) => (
              <li key={actor.id} className={styles.castItem}>
                <span className={styles.actorName}>{actor.name}</span>
                <span className={styles.actorRole}>{actor.role}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.panel}>
          <h3 className={styles.panelTitle}>Reviews</h3>
          {reviewCount === 0 ? (
            <p className={styles.empty}>No reviews yet.</p>
          ) : (
            <ul className={styles.reviewList}>
              {movie.reviews.map((review) => (
                <li key={review.id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewerName}>
                      {review.reviewerName}
                    </span>
                    <Stars rating={review.rating} />
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  )
}
