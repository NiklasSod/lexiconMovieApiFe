import Link from 'next/link'
import { cookies } from 'next/headers'
import styles from './Header.module.scss'
import FilmIcon from '../icons/FilmIcon'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies' },
  { label: 'My List', href: '/my-list' },
]

const Header = async () => {
  const cookieStore = await cookies()
  const isSignedIn = Boolean(cookieStore.get('auth_token')?.value)
  const navLinks = isSignedIn
    ? NAV_LINKS
    : NAV_LINKS.filter((link) => link.href !== '/my-list')

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <FilmIcon className={styles.logoIcon} />
        <span>
          Movie<span className={styles.logoAccent}>Api</span>Fe
        </span>
      </Link>

      <input
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
    </header>
  )
}

export default Header
