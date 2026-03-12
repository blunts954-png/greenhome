'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import CartDrawer from './CartDrawer';

export default function RootClientWrapper({ children }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!showContent) return;

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

    return () => observer.disconnect();
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
