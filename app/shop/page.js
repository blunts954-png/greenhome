import ProductGrid from '@/components/ProductGrid';
import styles from './Shop.module.css';

export const metadata = {
  title: "Shop All | Home Grown Money",
  description: "Browse the full Home Grown Money collection. Premium streetwear, hoodies, tees, and accessories.",
};

export default function ShopPage() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className="brand-font text-gradient">The Collection</h1>
          <p className={styles.subtitle}>Curated Growth.</p>
        </div>
      </section>

      <ProductGrid />
      
      <section className={styles.shippingInfo}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.infoBox}>
              <h3>Free Domestic Shipping</h3>
              <p>On all orders over $150.</p>
            </div>
            <div className={styles.infoBox}>
              <h3>Secure Checkout</h3>
              <p>Encrypted payments via Stripe & PayPal.</p>
            </div>
            <div className={styles.infoBox}>
              <h3>Limited Release</h3>
              <p>Once it&apos;s gone, it&apos;s rooted in history.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
