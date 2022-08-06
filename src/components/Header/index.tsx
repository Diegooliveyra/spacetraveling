import Link from 'next/link'
import styles from './header.module.scss'

export default function Header() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/">
          <a>
            <img src="./Logo.svg" alt="SpaceTraveling" />
          </a>
        </Link>
      </header>
    </main>
  )
}
