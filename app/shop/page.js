import ProductGrid from '@/components/ProductGrid';
import styles from './Shop.module.css';

export const metadata = {
  title: "Shop Home Grown Money | Apparel and Local Menu",
  description: "Browse the full Home Grown Money storefront. Apparel ships nationwide, while local Bakersfield menu items are clearly marked for pickup or local delivery only.",
  alternates: {
    canonical: '/shop',
  },
};

export default function ShopPage() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className="brand-font text-gradient reveal">The Collection</h1>
          <p className={`${styles.subtitle} reveal`}>Bakersfield Born. Clear Fulfillment. Real Inventory.</p>
        </div>
      </section>

      <ProductGrid />
      
      <section className={styles.shippingInfo}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.infoBox}>
              <h3>Accurate Checkout Flow</h3>
              <p>Reserve online, then choose card, cash, or Venmo at pickup or local delivery.</p>
            </div>
            <div className={styles.infoBox}>
              <h3>Clear Shipping Rules</h3>
              <p>Apparel can ship nationwide. Local menu items stay local to Bakersfield fulfillment.</p>
            </div>
            <div className={styles.infoBox}>
              <h3>Bakersfield Roots</h3>
              <p>Every live product photo in this drop is represented in the store.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
