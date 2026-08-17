import type { Review } from '../../types/movie'
import { useLayoutEffect, useRef, useState } from 'react'
import Stars from '../stars/Stars'
import styles from './ReviewItem.module.scss'

const ReviewItem = ({ review }: { review: Review }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const commentRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    if (isExpanded) return

    const el = commentRef.current
    if (!el) return

    const measure = () => {
      setIsOverflowing(el.scrollHeight > el.clientHeight)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [review.comment, isExpanded])

  return (
    <li className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <span className={styles.reviewerName}>{review.reviewerName}</span>
        <Stars rating={review.rating} />
      </div>
      <p
        ref={commentRef}
        className={
          isExpanded
            ? styles.reviewComment
            : `${styles.reviewComment} ${styles.clamped}`
        }
      >
        {review.comment}
      </p>
      {isOverflowing && (
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Show less' : 'Show more'}
          <svg
            className={
              isExpanded
                ? `${styles.chevron} ${styles.chevronUp}`
                : styles.chevron
            }
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </li>
  )
}

export default ReviewItem
