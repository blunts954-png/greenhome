import Image from 'next/image';
import styles from './About.module.css';
import Link from 'next/link';

export const metadata = {
  title: "Our Story | Home Grown Money",
  description: "The origin of Home Grown Money: Bakersfield-born premium streetwear and culture rooted in community, consistency, and the hustle.",
};

export default function AboutPage() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className="brand-font text-gradient reveal">The Roots</h1>
          <p className={`${styles.subtitle} reveal`}>Money Grows Where We Plant It. APTTMH.</p>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={`${styles.text} reveal`}>
              <h2 className="brand-font">All On Da Muscle</h2>
              <p>
                Home Grown Money was built in Bakersfield as a self-made venture rooted in local hustle and unshakeable self-belief. 
                Started by <strong>Oohdaddy & Cali</strong>, the brand is &quot;all on da muscle&quot;—no outside investors, just pure persistence and community support.
              </p>
              <div className={styles.quoteBox}>
                <p className={styles.quote}>
                  &quot;The plant built the roots. The culture carried the name. We aren&apos;t just a brand; we are a community staple transitioning from digital identity into a physical reality.&quot;
                </p>
              </div>
              <p>
                HGM has grown from a Bakersfield-based digital brand into a storefront identity that connects streetwear, local loyalty, and the everyday grind.
                The goal is simple: keep the brand rooted in the city while giving customers a clean, direct way to shop the drop and access the local menu.
              </p>
              <p>
                Everything on the site is meant to reflect that same approach, from product presentation to fulfillment rules, so customers know exactly what ships nationwide and what stays local to Bakersfield.
              </p>
            </div>
            <div className={`${styles.imageBox} reveal`}>
               <Image 
                 src="/images/store/flower.png" 
                 alt="HGM Brand Identity" 
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
          <h2 className="brand-font text-center reveal">The Hustle Path</h2>
          <div className={styles.timeline}>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2022</div>
              <div className={styles.event}>
                <h3>The First Seed</h3>
                <p>Started as a digital brand for branding purposes, planting the seeds of the Money Tree.</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2023</div>
              <div className={styles.event}>
                <h3>Local Momentum</h3>
                <p>The brand tightened its look, expanded apparel drops, and built stronger roots in the Bakersfield customer base.</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2024</div>
              <div className={styles.event}>
                <h3>Storefront Focus</h3>
                <p>Products, fulfillment, and brand presentation were organized into a cleaner storefront experience for apparel and the local menu.</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2026</div>
              <div className={styles.event}>
                <h3>Ready to Scale</h3>
                <p>Home Grown Money now stands as a brand built for repeat drops, local fulfillment, and a more polished customer experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.ctaSection} reveal`}>
        <div className={styles.container}>
          <h2 className="brand-font">Tap Into the Source</h2>
          <p>Browse premium streetwear or enter the Bakersfield local menu. All praises to the most high.</p>
          <div className={styles.ctaRow}>
            <Link href="/shop" className={styles.ctaBtn}>Shop Apparel</Link>
            <Link href="/shop?store=cannabis" className={styles.ctaBtnSecondary}>Bakersfield Local Menu</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
