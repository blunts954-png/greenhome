import Image from 'next/image';
import styles from './About.module.css';
import Link from 'next/link';

export const metadata = {
  title: "Our Story | Home Grown Money",
  description: "The origin of Home Grown Money, the Bakersfield cannabis business that also built a branded apparel lane around the same roots.",
};

export default function AboutPage() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className="brand-font text-gradient reveal">The Roots</h1>
          <p className={`${styles.subtitle} reveal`}>Money Grows Where We Plant It.</p>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={`${styles.text} reveal`}>
              <h2 className="brand-font">Built, Not Borrowed</h2>
              <p>
                Home Grown Money was built in Bakersfield as a cannabis business rooted in local hustle, consistency, and self-made growth. 
                Apparel came next, not as a separate company, but as an extension of the same identity that built the local menu and the customer base around it.
              </p>
              <div className={styles.quoteBox}>
                <p className={styles.quote}>
                  &quot;The plant built the roots. The clothing carried the name. Both sides of the business grew out of Bakersfield the same way: local first and built from the ground up.&quot;
                </p>
              </div>
              <p>
                From there, the mission stayed simple: keep the local menu clear, keep the apparel real, and make sure the business never loses the city it came from. 
                Home Grown Money is still built around that same code today.
              </p>
            </div>
            <div className={`${styles.imageBox} reveal`}>
               <Image 
                 src="/images/founder.png" 
                 alt="Home Grown Money Founder" 
                 fill
                 style={{ objectFit: 'cover' }}
                 className={styles.founderImg}
               />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <h2 className="brand-font text-center reveal">The Growth Path</h2>
          <div className={styles.timeline}>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2022</div>
              <div className={styles.event}>
                <h3>The First Seed</h3>
                <p>Home Grown Money started building its local cannabis roots in Bakersfield.</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2023</div>
              <div className={styles.event}>
                <h3>The Bloom</h3>
                <p>The brand expanded into apparel so customers could wear the identity the business was building locally.</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2024</div>
              <div className={styles.event}>
                <h3>Rooted Deep</h3>
                <p>The business tightened its Bakersfield presence with a clearer local menu and more consistent product identity.</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2026</div>
              <div className={styles.event}>
                <h3>The Harvest</h3>
                <p>Home Grown Money runs as a cannabis business with apparel attached, not the other way around.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.ctaSection} reveal`}>
        <div className={styles.container}>
          <h2 className="brand-font">Tap Into the Store</h2>
          <p>Browse the apparel drop or enter the Bakersfield local menu.</p>
          <Link href="/shop" className={styles.ctaBtn}>Open the Store</Link>
        </div>
      </section>
    </div>
  );
}
