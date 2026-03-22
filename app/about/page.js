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
                Represented by brand ambassador <strong>Asia the MF Dime</strong>, HGM has evolved from a Bakersfield-based digital brand into a community presence that bridges streetwear, art, and local industry. 
                Whether it&apos;s our interactive &quot;Puff & Paint&quot; brunches at 130 E. 21st St or our new storefront on <strong>Wake & Bake Blvd (210 Goodman St)</strong>, we are deeply intertwined with the city we call home.
              </p>
              <p>
                Our positive impact on Bakersfield youth and local culture has even caught the attention of <strong>23ABC News</strong>, highlighting our commitment to more than just commerce—it&apos;s about building a legacy.
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
                <h3>Puff & Paint</h3>
                <p>Launched community events at 130 E. 21st St, merging art and local culture into social brunches.</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2024</div>
              <div className={styles.event}>
                <h3>23ABC Recognition</h3>
                <p>Highlighted by local news for our positive impact on the community and commitment to the hustle.</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2026</div>
              <div className={styles.event}>
                <h3>Wake & Bake Blvd</h3>
                <p>Opened our 210 Goodman St location, cementing Home Grown Money as a physical staple on Bakersfield&apos;s map.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.ctaSection} reveal`}>
        <div className={styles.container}>
          <h2 className="brand-font">Tap Into the Source</h2>
          <p>Browse premium streetwear or enter the Bakersfield delivery menu. All praises to the most high.</p>
          <div className={styles.ctaRow}>
            <Link href="/shop" className={styles.ctaBtn}>Shop Apparel</Link>
            <Link href="/shop?store=cannabis" className={styles.ctaBtnSecondary}>Bakersfield Delivery</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
