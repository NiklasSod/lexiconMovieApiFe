'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import styles from './Header.module.scss'
import AuthModal from '../auth/AuthModal'

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
        <ul className={styles.navList}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

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
    </>
  )
}

export default HeaderNav
