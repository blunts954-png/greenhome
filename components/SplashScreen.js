'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './SplashScreen.module.css';
import audioEngine from '@/lib/AudioEngine'; // Import the physics sound engine

export default function SplashScreen({ onComplete }) {
  const [stage, setStage] = useState('entering'); // entering, pressurized, smoking, opening, hidden

  useEffect(() => {
    // Stage 1: Logo enters and "locks"
    const t1 = setTimeout(() => {
      setStage('pressurized');
      audioEngine.init(); // Initialize audio context on first interactive frame
      audioEngine.playClick(); // Heavy thud lock
    }, 1500);
    
    // Stage 2: Pressure builds (subtle shake or glow)
    const t2 = setTimeout(() => {
      setStage('smoking');
    }, 2500);
    
    // Stage 3: Hissing smoke and slow split start
    const t3 = setTimeout(() => {
      setStage('opening');
      audioEngine.playHiss(); // Trigger white noise hiss
    }, 4000);
    
    // Stage 4: Finish opening and start Sub Bass Hum
    const t4 = setTimeout(() => {
      setStage('hidden');
      if (onComplete) onComplete();
    }, 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
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
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`${styles.smoke} ${styles[`smoke${i + 1}`]}`}></div>
        ))}
      </div>
      
      {/* The Central Icon / Logo */}
      <div className={styles.logoContainer}>
        <div className={styles.logoHalfLeft}>
          <Image 
            src="/logo.png" 
            alt="Home Grown Money Logo" 
            width={400} 
            height={400} 
            className={styles.mainLogo}
            priority
          />
        </div>
        <div className={styles.logoHalfRight}>
          <Image 
            src="/logo.png" 
            alt="Home Grown Money Logo" 
            width={400} 
            height={400} 
            className={styles.mainLogo}
            priority
          />
        </div>
      </div>

      {/* Atmospheric Glow */}
      <div className={styles.centralGlow}></div>
    </div>
  );
}
