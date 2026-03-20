'use client';

import { useEffect, useState } from 'react';
import SplashScreen from './SplashScreen';
import CartDrawer from './CartDrawer';
import audioEngine from '@/lib/AudioEngine';
import BackToTop from './BackToTop';

export default function RootClientWrapper({ children }) {
  const [splashComplete, setSplashComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (splashComplete) {
      setShowContent(true);
    }
  }, [splashComplete]);

  useEffect(() => {
    if (!showContent) {
      return undefined;
    }

    const humRef = audioEngine.playSubHum();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealActive');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      audioEngine.stopSubHum(humRef);
    };
  }, [showContent]);

  return (
    <>
      {!splashComplete && <SplashScreen onComplete={() => setSplashComplete(true)} />}
      <CartDrawer />
      <BackToTop />
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transition: 'opacity 1s ease',
          visibility: showContent ? 'visible' : 'hidden'
        }}
      >
        {children}
      </div>
    </>
  );
}
