'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Mail, ShieldCheck, MapPin, Building2, Phone } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand Section */}
        <div className={styles.brand}>
          <Image src="/logo.png" alt="HGM Logo" width={120} height={120} className={styles.footerLogo} />
          <p className={styles.tagline}>Money Grows Where We Plant It.</p>
          <div className={styles.newsletter}>
            <h4>Be First for the Next Drop</h4>
            <div className={styles.emailForm}>
              <input type="email" placeholder="Email Address" className={styles.emailInput} />
              <button className={styles.emailBtn}>Join</button>
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
            <Link href="/shop/flower">Premium Flower</Link>
            <Link href="/shop/extracts">Extracts</Link>
            <Link href="/shop/apparel">Apparel</Link>
          </div>

          <div className={styles.linkStack}>
            <h5>The Hustle</h5>
            <Link href="/contact">Connect</Link>
            <Link href="/admin">Admin Login</Link>
            <a href="https://valleyorigin.com" target="_blank" rel="noopener noreferrer">Agency</a>
          </div>
        </div>

        {/* Contact Strip */}
        <div className={styles.contactStrip}>
          <div className={styles.contactItem}>
            <MapPin size={18} />
            <span>Bakersfield, CA</span>
          </div>
          <div className={styles.contactItem}>
            <Phone size={18} />
            <span>661-555-0123</span>
          </div>
          <div className={styles.contactItem}>
            <Mail size={18} />
            <span>hustle@homegrownmoney.com</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p className={styles.legal}>
            &copy; {currentYear} Home Grown Money &middot; Money grows where we plant it &middot; All rights reserved.
          </p>
          <div className={styles.footerSocials}>
            <a href="#"><Instagram size={18} /></a>
            <a href="#"><Facebook size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
