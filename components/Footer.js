import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = 2026; // As requested

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h2 className="brand-font text-gradient">Home Grown Money</h2>
          <p>Money Grows Where We Plant It.</p>
        </div>

        <div className={styles.links}>
          <div>
            <h4>Shop</h4>
            <ul>
              <li>All Products</li>
              <li>New Drops</li>
              <li>Accessories</li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li>Shipping & Returns</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h4>Social</h4>
            <ul>
              <li>Instagram</li>
              <li>X (Twitter)</li>
              <li>TikTok</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {currentYear} HOME GROWN MONEY. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
