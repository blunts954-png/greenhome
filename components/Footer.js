'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand Section */}
        <div className={styles.brand}>
          <Image src="/logo-mark.png" alt="HGM Logo" width={60} height={92} className={styles.footerLogo} />
          <p className={styles.tagline}>Money Grows Where We Plant It.</p>
          <div className={styles.newsletter}>
            <h4>Be First for the Next Drop</h4>
            <div className={styles.emailForm}>
              <input type="email" placeholder="Email Address" className={styles.emailInput} aria-label="Email address" />
              <Link href="/contact" className={styles.emailBtn}>Join</Link>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className={styles.linksGrid}>
          <div className={styles.linkStack}>
            <h5>The Brand</h5>
            <Link href="/about">Our Story</Link>
            <Link href="/about/faq">FAQ</Link>
            <Link href="/about/shipping">Shipping & Returns</Link>
          </div>
          
          <div className={styles.linkStack}>
            <h5>The Goods</h5>
            <Link href="/shop">All Products</Link>
            <Link href="/shop?store=cannabis">Local Menu</Link>
            <Link href="/shop/hgm-pink-tee">Featured Tee</Link>
            <Link href="/shop/hgm-reserve-flower">Reserve Flower</Link>
            <Link href="/shop/hgm-combo-deal">Combo Fits</Link>
          </div>

          <div className={styles.linkStack}>
            <h5>The Hustle</h5>
            <Link href="/contact">Connect</Link>
            <Link href="/about/faq">FAQ</Link>
            <Link href="/about/shipping">Shipping & Returns</Link>
          </div>
        </div>

        {/* Contact Strip */}
        <div className={styles.contactStrip}>
          <div className={styles.contactItem}>
            <MapPin size={18} />
            <span>Bakersfield, CA</span>
          </div>
          <div className={styles.contactItem}>
            <span>Apparel ships nationwide</span>
          </div>
          <div className={styles.contactItem}>
            <span>21+ cannabis reservations for local Bakersfield pickup or delivery</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <div className={styles.bottomCopy}>
            <p className={styles.legal}>
              &copy; {currentYear} Home Grown Money &middot; Money grows where we plant it &middot; All rights reserved.
            </p>
            <p className={styles.credit}>
              Power by{' '}
              <a
                href="https://chaoticallyorganizedai.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.creditLink}
              >
                ChaoticallyorganizedAI.com
              </a>
            </p>
          </div>
          <div className={styles.footerSocials}>
            <a href="https://instagram.com/homegrownmoney" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="https://facebook.com/homegrownmoney" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
