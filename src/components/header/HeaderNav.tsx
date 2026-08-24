'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import styles from './Header.module.scss'
import AuthModal from '../auth/AuthModal'
import AddMovieModal from '../movie/AddMovieModal'
import NavLinks from './NavLinks/NavLinks'

export type NavLink = {
  label: string
  href: string
}

const HeaderNav = ({
  navLinks,
  isSignedIn,
}: {
  navLinks: NavLink[]
  isSignedIn: boolean
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const toggleRef = useRef<HTMLInputElement>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false)

  // Always close the mobile menu after navigating to a new URL.
  useEffect(() => {
    if (toggleRef.current) {
      toggleRef.current.checked = false
    }
  }, [pathname])

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.refresh()
  }

  const handleAuthSuccess = () => {
    setIsAuthOpen(false)
    router.refresh()
  }

  return (
    <>
      <input
        ref={toggleRef}
        type="checkbox"
        id="nav-toggle"
        className={styles.navToggle}
        aria-label="Toggle menu"
      />

      <nav className={styles.nav} aria-label="Main navigation">
        <NavLinks
          navLinks={navLinks}
          isSignedIn={isSignedIn}
          setIsAddMovieOpen={setIsAddMovieOpen}
        />

        {isSignedIn ? (
          <button
            type="button"
            className={styles.signIn}
            onClick={handleSignOut}
          >
            Sign out
          </button>
        ) : (
          <button
            type="button"
            className={styles.signIn}
            onClick={() => setIsAuthOpen(true)}
          >
            Sign in
          </button>
        )}
      </nav>

      <label htmlFor="nav-toggle" className={styles.hamburger}>
        <span />
        <span />
        <span />
      </label>

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {isAddMovieOpen && (
        <AddMovieModal
          onClose={() => setIsAddMovieOpen(false)}
          onSuccess={() => {
            setIsAddMovieOpen(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}

export default HeaderNav
