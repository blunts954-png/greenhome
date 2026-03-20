import ProductGrid from '@/components/ProductGrid';
import styles from './Shop.module.css';

export const metadata = {
  title: "Shop Home Grown Money | Official Merch",
  description: "Browse the full Home Grown Money merch catalog with nationwide shipping and secure Stripe checkout for shipping orders.",
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
              <p>Shipping card payments are handled through Stripe, with a clean delivery-only checkout flow.</p>
            </div>
            <div className={styles.infoBox}>
              <h3>Clear Shipping Rules</h3>
              <p>Merch ships nationwide across the US with a straightforward checkout flow.</p>
            </div>
            <div className={styles.infoBox}>
              <h3>Drop Accuracy</h3>
              <p>Every live product photo in this drop is represented in the store.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
