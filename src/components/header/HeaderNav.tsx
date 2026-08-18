'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import styles from './Header.module.scss'

export type NavLink = {
  label: string
  href: string
}

const HeaderNav = ({ navLinks }: { navLinks: NavLink[] }) => {
  const pathname = usePathname()
  const toggleRef = useRef<HTMLInputElement>(null)

  // Always close the mobile menu after navigating to a new URL.
  useEffect(() => {
    if (toggleRef.current) {
      toggleRef.current.checked = false
    }
  }, [pathname])

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

        {/* use Link when login works
        <Link href="/sign-in" className={styles.signIn}>
          Sign in
        </Link>
        remove button when login works */}
        <button type="button" className={styles.signIn} disabled>
          Sign in
        </button>
      </nav>

      <label htmlFor="nav-toggle" className={styles.hamburger}>
        <span />
        <span />
        <span />
      </label>
    </>
  )
}

export default HeaderNav
