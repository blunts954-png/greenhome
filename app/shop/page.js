import ProductGrid from '@/components/ProductGrid';
import styles from './Shop.module.css';

export const metadata = {
  title: "Shop Home Grown Money | Apparel and Bakersfield Local Menu",
  description: "Browse Home Grown Money apparel with nationwide shipping and Stripe checkout, plus the 21+ Bakersfield local cannabis menu for pickup reservations.",
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
              <p>Apparel can ship with Stripe or be arranged for Bakersfield pickup, while cannabis stays local and pickup-only.</p>
            </div>
            <div className={styles.infoBox}>
              <h3>Clear Shipping Rules</h3>
              <p>Apparel ships nationwide across the US. Cannabis is 21+ and reserved for Bakersfield pickup only.</p>
            </div>
            <div className={styles.infoBox}>
              <h3>Separated Menus</h3>
              <p>The apparel catalog and local cannabis menu are split cleanly so customers know what can ship and what stays local.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
