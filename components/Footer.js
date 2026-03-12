import Link from 'next/link';
import { Instagram, Twitter, MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h2 className="brand-font text-gradient">Home Grown Money</h2>
          <p>Money Grows Where We Plant It.</p>
          <div className={styles.newsletter}>
            <h4>Be First for the Next Drop</h4>
            <div className={styles.emailWrapper}>
              <input type="email" placeholder="ENTER YOUR EMAIL" className={styles.emailInput} />
              <button className={styles.emailBtn}>JOIN</button>
            </div>
          </div>
        </div>

        <div className={styles.links}>
          <div className={styles.linkCol}>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop">All Products</Link></li>
              <li><Link href="/shop/new-drops">New Drops</Link></li>
              <li><Link href="/shop/accessories">Accessories</Link></li>
            </ul>
          </div>
          <div className={styles.linkCol}>
            <h4>Support</h4>
            <ul>
              <li><Link href="/support/shipping">Shipping & Returns</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/legal/privacy">Privacy Policy</Link></li>
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
        <p>&copy; {currentYear} HOME GROWN MONEY. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
