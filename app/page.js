import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import ValueProp from "@/components/ValueProp";
import Link from 'next/link';
import styles from './page.module.css';

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

      <section className={`${styles.ctaBanner} reveal`}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className="brand-font">Next Drop Coming Soon</h2>
            <p>Don&apos;t be the last to know. Join the inner circle.</p>
            <div className={styles.countdown}>
              <div className={styles.countItem}>
                <span>04</span>
                <label>DAYS</label>
              </div>
              <div className={styles.countItem}>
                <span>12</span>
                <label>HOURS</label>
              </div>
              <div className={styles.countItem}>
                <span>30</span>
                <label>MINS</label>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
