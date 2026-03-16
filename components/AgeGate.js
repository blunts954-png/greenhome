'use client';

import { useState, useEffect } from 'react';
import styles from './AgeGate.module.css';

export default function AgeGate() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified');
    if (!isVerified) {
      setIsVisible(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.logoContainer}>
            <span className={styles.brand}>HGM</span>
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
