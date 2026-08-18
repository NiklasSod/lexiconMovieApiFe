'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import styles from './Pagination.module.scss'

type PaginationProps = {
  currentPage: number
  totalPages: number
}

export const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return

    const params = new URLSearchParams(searchParams.toString())

    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }

    const query = params.toString()
    router.replace(query ? `/movies?${query}` : '/movies', { scroll: false })
  }

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className={styles.pagination} aria-label="Movies pagination">
      <button
        type="button"
        className={styles.arrow}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={
            page === currentPage
              ? `${styles.page} ${styles.active}`
              : styles.page
          }
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => goToPage(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={styles.arrow}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  )
}
