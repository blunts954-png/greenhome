'use client';

import Link from 'next/link';
import styles from './Hero.module.css';
import Particles from './Particles';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Particles />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={`${styles.headline} reveal`}>Money Grows Where We Plant It</h1>
        <div className={`${styles.newDropBadge} reveal`}>
          <span>APPAREL (US-WIDE SHIPPING) + BAKERSFIELD DRUGS & DELIVERY</span>
        </div>
        <p className={`${styles.subcopy} reveal`}>
          Premium HGM apparel ships across the United States. Bakersfield & Riverside local cannabis delivery and 21+ reservations stay local.
        </p>
        <div className={`${styles.ctaContainer} reveal`}>
          <Link href="/shop" className={styles.primaryCta}>SHOP APPAREL</Link>
          <Link href="/shop?store=cannabis" className={styles.secondaryCta}>LOCAL DELIVERY MENU</Link>
        </div>
      </div>
    </section>
  );
}
