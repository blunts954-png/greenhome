import ProductGrid from '@/components/ProductGrid';
import styles from './Shop.module.css';

export const metadata = {
  title: "Shop Cannabis Streetwear | HGM — Bakersfield Born",
  description: "Browse the full Home Grown Money collection. Premium cannabis-culture streetwear, hoodies, tees, and accessories. Rooted in the 661.",
};

export default function ShopPage() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className="brand-font text-gradient reveal">The Collection</h1>
          <p className={`${styles.subtitle} reveal`}>Bakersfield Born. Cultivated Quality.</p>
        </div>
      </section>

      <ProductGrid />
      
      <section className={styles.shippingInfo}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.infoBox}>
              <h3>In-Store Pickup Only</h3>
              <p>Reserve online, pay and pick up in-store.</p>
            </div>
            <div className={styles.infoBox}>
              <h3>Cash on Pickup</h3>
              <p>Secure in-person transactions only.</p>
            </div>
            <div className={styles.infoBox}>
              <h3>Bakersfield Roots</h3>
              <p>Supporting local culture and community.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
