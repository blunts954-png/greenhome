import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <h1 className={`${styles.logoMain} brand-font`}>HGM</h1>
          <div className={styles.glow}></div>
        </div>
        <h2 className={styles.headline}>Money Grows Where We Plant It</h2>
        <p className={styles.subcopy}>
          Premium streetwear rooted in culture, community, and the hustle.
        </p>
        <div className={styles.ctaContainer}>
          <button className={styles.primaryCta}>Shop the Drop</button>
          <button className={styles.secondaryCta}>Our Story</button>
        </div>
      </div>
    </section>
  );
}
