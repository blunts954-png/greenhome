'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import CartDrawer from './CartDrawer';
import audioEngine from '@/lib/AudioEngine';
import BackToTop from './BackToTop';

import AgeGate from './AgeGate';

export default function RootClientWrapper({ children }) {
  const [splashComplete, setSplashComplete] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (ageVerified && splashComplete) {
      setShowContent(true);
    }
  }, [ageVerified, splashComplete]);

  useEffect(() => {
    if (!showContent) return;

    // Start Sub-Bass when content is revealed
    const humRef = audioEngine.playSubHum();

    const observerOption = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealActive');
        }
      });
    }, observerOption);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
      audioEngine.stopSubHum(humRef);
    };
  }, [showContent]);

  return (
    <>
      {!splashComplete && <SplashScreen onComplete={() => setSplashComplete(true)} />}
      {splashComplete && <AgeGate isActive={splashComplete} onVerify={() => setAgeVerified(true)} />}
      <CartDrawer />
      <BackToTop />
      <div style={{ opacity: showContent ? 1 : 0, transition: 'opacity 1s ease', visibility: showContent ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </>
  );
}
