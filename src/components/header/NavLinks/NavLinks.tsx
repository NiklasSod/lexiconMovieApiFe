import Link from 'next/link'
import styles from './Navlinks.module.scss'
import { NavLink } from '../HeaderNav'
import { Dispatch, SetStateAction } from 'react'

interface NavLinksProps {
  navLinks: NavLink[]
  isSignedIn: boolean
  setIsAddMovieOpen: Dispatch<SetStateAction<boolean>>
}

const NavLinks = ({
  navLinks,
  isSignedIn,
  setIsAddMovieOpen,
}: NavLinksProps) => {
  return (
    <ul className={styles.navList}>
      {navLinks.flatMap((link) => {
        const items = [
          <li key={link.href}>
            <Link href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          </li>,
        ]

        if (isSignedIn && link.href === '/my-list') {
          items.push(
            <li key="add-movie">
              <button
                type="button"
                className={styles.addMovie}
                onClick={() => setIsAddMovieOpen((prev) => !prev)}
              >
                Add movie
              </button>
            </li>,
          )
        }

        return items
      })}
    </ul>
  )
}

export default NavLinks
