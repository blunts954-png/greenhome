'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { Instagram, Facebook, Menu, ShoppingCart, X } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const cartContext = useCart();
  const { cartCount = 0, toggleDrawer = () => {} } = cartContext || {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleCartClick = () => {
    toggleDrawer();
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link href="/" onClick={handleLinkClick} className={styles.logoLink}>
              <span className={styles.logoMark}>
                <Image src="/logo-mark.png" alt="HGM Logo" width={40} height={64} className={styles.navLogo} priority />
              </span>
              <span className={styles.logoText}>
                <span>Home Grown</span>
                <span>Money</span>
              </span>
            </Link>
          </div>
          
          <ul className={styles.navLinks}>
            <li><Link href="/shop" onClick={handleLinkClick}>Shop</Link></li>
            <li><Link href="/shop?store=cannabis" onClick={handleLinkClick}>Local Menu</Link></li>
            <li><Link href="/about/shipping" onClick={handleLinkClick}>Shipping</Link></li>
            <li><Link href="/about" onClick={handleLinkClick}>Our Story</Link></li>
            <li><Link href="/contact" onClick={handleLinkClick}>Connect</Link></li>
          </ul>

          <div className={styles.actions}>
            <div className={styles.socials}>
              <a href="https://instagram.com/homegrownmoney" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="https://facebook.com/homegrownmoney" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
            </div>
            
            <button className={styles.cartBtn} onClick={handleCartClick} aria-label="Open cart">
              <ShoppingCart size={21} />
              {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
            </button>

            <button className={styles.menuBtn} onClick={handleMenuToggle} aria-label="Open navigation">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <Link href="/shop" onClick={handleLinkClick}>Shop</Link>
        <Link href="/shop?store=cannabis" onClick={handleLinkClick}>Local Menu</Link>
        <Link href="/about/shipping" onClick={handleLinkClick}>Shipping</Link>
        <Link href="/about" onClick={handleLinkClick}>Our Story</Link>
        <Link href="/about/faq" onClick={handleLinkClick}>FAQ</Link>
        <Link href="/contact" onClick={handleLinkClick}>Connect</Link>
        <div className={styles.mobileSocials}>
          <a href="https://instagram.com/homegrownmoney" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://facebook.com/homegrownmoney" target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
      </div>
    </>
  );
}
