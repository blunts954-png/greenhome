import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <span className="brand-font text-gradient">Home Grown Money</span>
          </Link>
        </div>
        
        <ul className={styles.navLinks}>
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/about">Our Story</Link></li>
          <li><Link href="/contact">Connect</Link></li>
        </ul>

        <div className={styles.actions}>
          <div className={styles.socials}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
          </div>
          <button className={styles.cartButton}>Cart (0)</button>
        </div>
      </div>
    </nav>
  );
}
