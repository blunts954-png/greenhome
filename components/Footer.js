'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Instagram, Twitter, MessageCircle, Check } from 'lucide-react';
import styles from './Footer.module.css';
import audioEngine from '@/lib/AudioEngine';

export default function Footer() {
  const currentYear = 2026;
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) return;
    try { audioEngine.playClick(); } catch(e){}
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h2 className="brand-font text-gradient">Home Grown Money</h2>
          <p className={styles.tagline}>Money Grows Where We Plant It.</p>
          <div className={styles.newsletter}>
            <h4>Be First for the Next Drop</h4>
            <div className={styles.emailWrapper}>
              <input 
                type="email" 
                placeholder={isSubscribed ? "YOU'RE IN." : "ENTER YOUR EMAIL"} 
                className={`${styles.emailInput} ${isSubscribed ? styles.success : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribed}
              />
              <button 
                className={styles.emailBtn} 
                onClick={handleSubscribe}
                disabled={isSubscribed}
              >
                {isSubscribed ? <Check size={18} /> : 'JOIN'}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.links}>
          <div className={styles.linkCol}>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop">All Products</Link></li>
              <li><Link href="/shop">Limited Drops</Link></li>
              <li><Link href="/shop">Accessories</Link></li>
            </ul>
          </div>
          <div className={styles.linkCol}>
            <h4>Support</h4>
            <ul>
              <li><Link href="/contact">Shipping & Returns</Link></li>
              <li><Link href="/contact">Connect</Link></li>
              <li><Link href="/contact">FAQ</Link></li>
            </ul>
          </div>
          <div className={styles.linkCol}>
            <h4>Social</h4>
            <div className={styles.footerSocials}>
              <a href="https://instagram.com/homegrownmoney" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com/homegrownmoney" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="https://tiktok.com/@homegrownmoney" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottomMeta}>
          <p>&copy; {currentYear} HOME GROWN MONEY. ALL RIGHTS RESERVED.</p>
          <Link href="/admin" className={styles.adminLink}>ADMIN TERMINAL</Link>
        </div>
        <p className={styles.valleyOrigin}>BAKERSFIELD BORN. CULTIVATED GLOBALLY.</p>
      </div>
    </footer>
  );
}
