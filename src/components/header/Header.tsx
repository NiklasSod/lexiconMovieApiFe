import Link from 'next/link'
import styles from './Header.module.scss'
import FilmIcon from '../icons/FilmIcon'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies' },
  { label: 'My List', href: '/my-list' },
]

const Header = () => {
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
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/sign-in" className={styles.signIn}>
          Sign in
        </Link>
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
