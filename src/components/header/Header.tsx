import Link from 'next/link'
import { cookies } from 'next/headers'
import styles from './Header.module.scss'
import FilmIcon from '../icons/FilmIcon'
import HeaderNav from './HeaderNav'
import { ACCESS_TOKEN_COOKIE } from '@/services/authCookies'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies' },
  { label: 'My List', href: '/my-list' },
]

const Header = async () => {
  const cookieStore = await cookies()
  const isSignedIn = Boolean(cookieStore.get(ACCESS_TOKEN_COOKIE)?.value)
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

      <HeaderNav navLinks={navLinks} isSignedIn={isSignedIn} />
    </header>
  )
}

export default Header
