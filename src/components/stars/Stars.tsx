import styles from './Stars.module.scss'

interface StartsProps {
  rating: number
}

const Stars = ({ rating }: StartsProps) => {
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

export default Stars
