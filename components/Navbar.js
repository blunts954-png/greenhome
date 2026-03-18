'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { Instagram, Facebook, ShoppingCart } from 'lucide-react';
import audioEngine from '@/lib/AudioEngine';
import styles from './Navbar.module.css';

export default function Navbar() {
  const cartContext = useCart();
  const { cartCount = 0, toggleDrawer = () => {} } = cartContext || {};

  const handleCartClick = () => {
    audioEngine.playClick();
    toggleDrawer();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image src="/logo.png" alt="HGM Logo" width={50} height={50} className={styles.navLogo} />
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
          <button className={styles.cartButton} onClick={handleCartClick}>
            <ShoppingCart size={16} />
            <span>Cart ({cartCount})</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
