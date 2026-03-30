'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './SplashScreen.module.css';

export default function SplashScreen({ onComplete }) {
  const [stage, setStage] = useState('entering'); // entering, opening, hidden

  useEffect(() => {
    // Stage 1: Fast Entry (0.75s)
    const t1 = setTimeout(() => {
      setStage('opening');
    }, 750);
    
    // Stage 2: Fade out / Reveal (Total 3.2s)
    const t2 = setTimeout(() => {
      setStage('hidden');
      if (onComplete) onComplete();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (stage === 'hidden') return null;

  return (
    <div className={`${styles.splashOverlay} ${styles[stage]}`}>
      {/* Background Doors */}
      <div className={styles.doorLeft}></div>
      <div className={styles.doorRight}></div>

      {/* Volumetric Smoke Particles */}
      <div className={styles.smokeContainer}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`${styles.smoke} ${styles[`smoke${i + 1}`]}`}></div>
        ))}
      </div>
      
      {/* The Central Icon / Logo */}
      <div className={styles.logoContainer}>
        <div className={styles.logoHalfLeft}>
          <div className={styles.logoBadge}>
            <Image 
              src="/logo-mark.png" 
              alt="Home Grown Money Logo" 
              width={260} 
              height={410} 
              className={styles.mainLogo}
              priority
            />
          </div>
        </div>
        <div className={styles.logoHalfRight}>
          <div className={styles.logoBadge}>
            <Image 
              src="/logo-mark.png" 
              alt="Home Grown Money Logo" 
              width={260} 
              height={410} 
              className={styles.mainLogo}
              priority
            />
          </div>
        </div>
      </div>

      {/* Smoke Spells Welcome */}
      <div className={`${styles.smokeWelcome} ${stage === 'opening' ? styles.showWelcome : ''}`}>
        {"WELCOME".split("").map((letter, i) => (
          <span key={i} className={styles.smokeLetter} style={{'--delay': `${i * 0.1}s`}}>
            {letter}
          </span>
        ))}
      </div>

      {/* Atmospheric Glow */}
      <div className={styles.centralGlow}></div>
    </div>
  );
}
