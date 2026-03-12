'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Instagram, Facebook, ShoppingCart } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { cartCount, toggleDrawer } = useCart();

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
            <a href="https://instagram.com/homegrownmoney" target="_blank" rel="noopener noreferrer">
              <Instagram size={18} />
            </a>
            <a href="https://facebook.com/homegrownmoney" target="_blank" rel="noopener noreferrer">
              <Facebook size={18} />
            </a>
          </div>
          <button className={styles.cartButton} onClick={toggleDrawer}>
            <ShoppingCart size={16} />
            <span>Cart ({cartCount})</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
