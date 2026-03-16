import Image from 'next/image';
import styles from './About.module.css';
import Link from 'next/link';

export const metadata = {
  title: "Our Story | Home Grown Money",
  description: "The origin of Home Grown Money. Founded in Bakersfield, rooted in persistence, and built for the hustle.",
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
              <h2 className="brand-font">Bakersfield Born</h2>
              <p>
                Home Grown Money didn&apos;t start in a boardroom. It started in the 661—where the Valley sun 
                burns as hot as the ambition. We grew up watching the hustle from the ground up, seeing the 
                grit it takes to build something that lasts in a town known for its roots.
              </p>
              <div className={styles.quoteBox}>
                <p className={styles.quote}>
                  "In the Valley, we don't wait for the rain. We build the irrigation ourselves."
                </p>
              </div>
              <p>
                The name reflects a simple truth: growth only happens through cultivation. 
                Whether it&apos;s wealth, knowledge, or influence, you have to plant the seed 
                and nurture it yourself. Nobody is handing out harvests for free in Bakersfield.
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
                <p>HGM launched with 3 designs out of a garage in East Bakersfield.</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2023</div>
              <div className={styles.event}>
                <h3>The Bloom</h3>
                <p>Expanded to the full 'Money Grows' collection. High-end textiles met the hustle.</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2024</div>
              <div className={styles.event}>
                <h3>Rooted Deep</h3>
                <p>Opened our first flagship presence and collaborated with local Valley artists.</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} reveal`}>
              <div className={styles.year}>2026</div>
              <div className={styles.event}>
                <h3>The Harvest</h3>
                <p>HGM becomes a global symbol for those who cultivate their own future.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.ctaSection} reveal`}>
        <div className={styles.container}>
          <h2 className="brand-font">Join the Movement</h2>
          <p>Don't just watch the growth. Be part of the cultivation.</p>
          <Link href="/shop" className={styles.ctaBtn}>Shop the Collection</Link>
        </div>
      </section>
    </div>
  );
}
