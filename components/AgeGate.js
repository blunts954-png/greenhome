'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './AgeGate.module.css';

function removeTestAgeFromUrl() {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete('test_age');
  const nextUrl = `${url.pathname}${url.search ? url.search : ''}${url.hash}`;
  window.history.replaceState({}, '', nextUrl);
}

export default function AgeGate({ onVerify, isActive }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      return undefined;
    }

    const isVerified = localStorage.getItem('age-verified') === 'true';
    const forceTest = window.location.search.includes('test_age');

    if (!isVerified || forceTest) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }

    if (onVerify) {
      onVerify();
    }

    return undefined;
  }, [isActive, onVerify]);

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setIsVisible(false);

    if (window.location.search.includes('test_age')) {
      removeTestAgeFromUrl();
    }

    if (onVerify) {
      onVerify();
    }
  };

  if (!isVisible || !isActive) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
      >
        <div className={styles.logoContainer}>
          <Image src="/logo-mark.png" alt="HGM Logo" width={54} height={84} className={styles.ageLogo} priority />
        </div>
        <h2 id="age-gate-title">ARE YOU 21 OR OVER?</h2>
        <p>You must be 21+ with valid ID to view and reserve items for Bakersfield pickup or delivery.</p>
        <div className={styles.actions}>
          <button type="button" className={styles.verifyBtn} onClick={handleVerify}>
            YES, I AM 21+
          </button>
          <a href="https://www.google.com" className={styles.exitLink}>
            NO, EXIT
          </a>
        </div>
        <p className={styles.disclaimer}>
          Entering confirms you are of legal age and understand that cannabis reservations are for local Bakersfield pickup or delivery only.
        </p>
      </div>
    </div>
  );
}
