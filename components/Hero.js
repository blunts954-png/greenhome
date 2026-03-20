'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';
import Particles from './Particles';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Particles />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={`${styles.eyebrow} reveal`}>Bakersfield born. Built for the drop.</div>
        <h2 className={`${styles.headline} reveal`}>Money Grows Where We Plant It</h2>
        <div className={`${styles.newDropBadge} reveal`}>
          <span>NEW T-SHIRT DROP — $20</span>
        </div>
        <p className={`${styles.subcopy} reveal`}>
          Premium Valley streetwear, crafted for the hustle. Grab the new HGM Tee for $20 or secure the Hat & Shirt Combo for $30. 
        </p>
        <div className={`${styles.ctaContainer} reveal`}>
          <Link href="/shop" className={styles.primaryCta}>COP THE DROP</Link>
          <Link href="/shop/hgm-combo-deal" className={styles.secondaryCta}>COMBO DEALS</Link>
        </div>
      </div>
    </section>
  );
}
