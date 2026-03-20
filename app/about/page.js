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
              <h2 className="brand-font">Built, Not Borrowed</h2>
              <p>
                Home Grown Money was born the day our founder realized nobody was coming to save him, 
                sponsor him, or stamp his name with a cosign. It was either build his own lane or stay stuck in traffic. 
                In Bakersfield, he planted a seed with no investors, no endorsements, and no &quot;big organization&quot; umbrella, 
                just muscle, faith, and a stubborn refusal to fold.
              </p>
              <div className={styles.quoteBox}>
                <p className={styles.quote}>
                  &quot;That moment turned a hustler into a brand architect, when &apos;nothing for sale, just branding&apos; 
                  stopped being a caption and became a code he lived by.&quot;
                </p>
              </div>
              <p>
                From that day forward, every event, every reel, every late-night idea stopped being content 
                and started being proof that belief in your own name can grow into a street-certified legacy. 
                We don&apos;t manufacture hype—we manufacture heritage.
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
                <p>Expanded to the full &apos;Money Grows&apos; collection. High-end textiles met the hustle.</p>
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
          <p>Don&apos;t just watch the growth. Be part of the cultivation.</p>
          <Link href="/shop" className={styles.ctaBtn}>Shop the Collection</Link>
        </div>
      </section>
    </div>
  );
}
