'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './AgeGate.module.css';

export default function AgeGate({ onVerify, isActive }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      const isVerified = localStorage.getItem('age-verified');
      const forceTest = window.location.search.includes('test_age');
      
      console.log('AgeGate Check - Verified:', isVerified, 'Force:', forceTest);
      
      if (!isVerified || forceTest) {
        // Small delay to let the splash unmount cleanly
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
      } else if (onVerify) {
        onVerify();
      }
    }
  }, [isActive, onVerify]);

  const handleVerify = () => {
    console.log('AgeGate - Verifying User');
    localStorage.setItem('age-verified', 'true');
    setIsVisible(false);
    // Remove query param if present
    if (window.location.search.includes('test_age')) {
       window.history.replaceState({}, '', window.location.pathname);
    }
    if (onVerify) onVerify();
  };

  if (!isVisible || !isActive) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="HGM Logo" width={80} height={80} className={styles.ageLogo} />
        </div>
        <h2>ARE YOU OF LEGAL AGE?</h2>
        <p>You must be 21+ to enter the Home Grown Money experience.</p>
        <div className={styles.actions}>
          <button className={styles.verifyBtn} onClick={handleVerify}>I AM 21+</button>
          <a href="https://www.google.com" className={styles.exitLink}>I AM NOT</a>
        </div>
        <p className={styles.disclaimer}>
          By entering, you agree to our terms of service and privacy policy. 
          Money grows where we plant it responsibly.
        </p>
      </div>
    </div>
  );
}
