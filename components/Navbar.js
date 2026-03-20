'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { Instagram, Facebook, Menu, ShoppingCart, X } from 'lucide-react';
import audioEngine from '@/lib/AudioEngine';
import styles from './Navbar.module.css';

export default function Navbar() {
  const cartContext = useCart();
  const { cartCount = 0, toggleDrawer = () => {} } = cartContext || {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleCartClick = () => {
    audioEngine.playClick();
    toggleDrawer();
  };

  const handleMenuToggle = () => {
    try { audioEngine.playClick(); } catch (e) {}
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    try { audioEngine.playClick(); } catch (e) {}
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <a href="/" onClick={handleLinkClick} className={styles.logoLink}>
              <Image src="/logo_v3.jpg" alt="HGM Logo" width={40} height={40} className={styles.navLogo} />
              <span className={styles.logoText}>Home Grown Money</span>
            </a>
          </div>
          
          <ul className={styles.navLinks}>
            <li><a href="/shop" onClick={handleLinkClick}>Shop</a></li>
            <li><a href="/about/shipping" onClick={handleLinkClick}>Shipping</a></li>
            <li><a href="/about" onClick={handleLinkClick}>Our Story</a></li>
            <li><a href="/contact" onClick={handleLinkClick}>Connect</a></li>
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
        <a href="/shop" onClick={handleLinkClick}>Shop</a>
        <a href="/about/shipping" onClick={handleLinkClick}>Shipping</a>
        <a href="/about" onClick={handleLinkClick}>Our Story</a>
        <a href="/about/faq" onClick={handleLinkClick}>FAQ</a>
        <a href="/contact" onClick={handleLinkClick}>Connect</a>
        <div className={styles.mobileSocials}>
          <a href="https://instagram.com/homegrownmoney" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://facebook.com/homegrownmoney" target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
      </div>
    </>
  );
}
