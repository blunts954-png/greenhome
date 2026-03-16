import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import ValueProp from "@/components/ValueProp";
import SocialFeed from '@/components/SocialFeed';
import Link from 'next/link';
import styles from './page.module.css';
import Countdown from '@/components/Countdown';

export default function Home() {
  return (
    <>
      <Hero />
      <ValueProp />
      
      <section className={`${styles.brandStory} reveal`}>
        <div className={styles.container}>
          <div className={styles.storyContent}>
            <h2 className="brand-font text-gradient">Cultivated in the Valley</h2>
            <p>
              Founded in Bakersfield, Home Grown Money is a testament to the power of persistence. 
              We don&apos;t manufacture hype—we manufacture heritage. Every piece is a seed planted 
              for a future built by hand.
            </p>
            <Link href="/about" className={styles.storyBtn}>Read Our Story</Link>
          </div>
        </div>
      </section>

      <div className="reveal">
        <ProductGrid />
      </div>

      <SocialFeed />

      <section className={`${styles.ctaBanner} reveal`}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className="brand-font">SECURE THE NEW DROP</h2>
            <p>New HGM Tees are live. $20 for the culture. $30 for the Shirt & Hat combo. Limited quantities rooted in Bakersfield.</p>
            <div className={styles.ctaValues}>
              <div className={styles.vItem}><span>TEE</span> <strong>$20</strong></div>
              <div className={styles.vItem}><span>HAT</span> <strong>$15</strong></div>
              <div className={styles.vItem}><span>COMBO</span> <strong>$30</strong></div>
            </div>
            <Link href="/shop" className={styles.ctaShopBtn}>SHOP THE DROP NOW</Link>
          </div>
        </div>
      </section>
    </>
  );
}
