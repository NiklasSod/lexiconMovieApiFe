import { useState, Dispatch, SetStateAction } from 'react'
import type { Review } from '../../types/movie'
import styles from './ReviewList.module.scss'
import { useIsClient } from '../../utils/useSyncExternalStore'
import ReviewItem from '../ReviewItem/ReviewItem'

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

  // randomness makes client rendering differ from server
  // causing a hydration mismatch, solution render nothing on server
  const isClient = useIsClient()
  if (!isClient) return null

  return (
    <section className={styles.panel}>
      <h3 className={styles.panelTitle}>Reviews</h3>
      {reviewCount === 0 ? (
        <p className={styles.empty}>No reviews yet.</p>
      ) : (
        <>
          <ul className={styles.reviewList}>
            {shuffledReviews.slice(0, visibleReviews).map((review) => (
              <ReviewItem key={review.id} review={review} />
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
