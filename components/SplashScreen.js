'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './SplashScreen.module.css';

export default function SplashScreen({ onComplete }) {
  const [stage, setStage] = useState('entering'); // entering, smoking, opening, hidden

  useEffect(() => {
    // 1. Entering stage: Logo fades in
    const t1 = setTimeout(() => setStage('smoking'), 1000);
    
    // 2. Smoking stage: Smoke bursts out
    const t2 = setTimeout(() => setStage('opening'), 2500);
    
    // 3. Opening stage: Screen splits/reveals
    const t3 = setTimeout(() => {
      setStage('hidden');
      if (onComplete) onComplete();
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (stage === 'hidden') return null;

  return (
    <div className={`${styles.splashOverlay} ${styles[stage]}`}>
      <div className={styles.smokeContainer}>
        <div className={`${styles.smoke} ${styles.smoke1}`}></div>
        <div className={`${styles.smoke} ${styles.smoke2}`}></div>
        <div className={`${styles.smoke} ${styles.smoke3}`}></div>
      </div>
      
      <div className={styles.logoWrapper}>
        <Image 
          src="/logo.png" 
          alt="Home Grown Money Logo" 
          width={400} 
          height={400} 
          className={styles.mainLogo}
          priority
        />
      </div>

      <div className={styles.revealDoors}>
        <div className={styles.doorLeft}></div>
        <div className={styles.doorRight}></div>
      </div>
    </div>
  );
}
