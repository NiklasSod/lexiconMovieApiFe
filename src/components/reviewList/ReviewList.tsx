import type { Review } from '../../types/movie'
import { Dispatch, SetStateAction, useState } from 'react'
import { Stars } from '../movie/FeaturedMovie'
import styles from './ReviewList.module.scss'

interface ReviewListProps {
  reviews: Review[]
  visibleReviews: number
  setVisibleReviews: Dispatch<SetStateAction<number>>
  reviewCount: number
}

const ReviewList = ({
  reviews,
  visibleReviews,
  setVisibleReviews,
  reviewCount,
}: ReviewListProps) => {
  const [shuffledReviews] = useState(() =>
    reviews ? [...reviews].sort(() => Math.random() - 0.5) : [],
  )

  return (
    <section className={styles.panel}>
      <h3 className={styles.panelTitle}>Reviews</h3>
      {reviewCount === 0 ? (
        <p className={styles.empty}>No reviews yet.</p>
      ) : (
        <>
          <ul className={styles.reviewList}>
            {shuffledReviews.slice(0, visibleReviews).map((review) => (
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
          {visibleReviews < reviewCount && (
            <button
              type="button"
              className={styles.showMoreButton}
              onClick={() => setVisibleReviews((count) => count + 1)}
            >
              Show more
            </button>
          )}
        </>
      )}
    </section>
  )
}

export default ReviewList
