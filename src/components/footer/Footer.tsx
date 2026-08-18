import Link from 'next/link'
import styles from './Footer.module.scss'
import FilmIcon from '../icons/FilmIcon'

const FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies' },
]

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <FilmIcon className={styles.logoIcon} />
          <span>
            Movie<span className={styles.logoAccent}>Api</span>Fe
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Footer navigation">
          <ul className={styles.navList}>
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className={styles.copy}>© {year} MovieApiFe. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
