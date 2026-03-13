'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import CartDrawer from './CartDrawer';
import audioEngine from '@/lib/AudioEngine';

export default function RootClientWrapper({ children }) {
  const [showContent, setShowContent] = useState(false);

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
      {!showContent && <SplashScreen onComplete={() => setShowContent(true)} />}
      <CartDrawer />
      <div style={{ opacity: showContent ? 1 : 0, transition: 'opacity 1s ease' }}>
        {children}
      </div>
    </>
  );
}
