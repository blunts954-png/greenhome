'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import SplashScreen from './SplashScreen';
import CartDrawer from './CartDrawer';
import BackToTop from './BackToTop';

export default function RootClientWrapper({ children }) {
  const [splashComplete, setSplashComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (splashComplete) {
      setShowContent(true);
    }
  }, [splashComplete]);

  useEffect(() => {
    if (!showContent) return undefined;

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

    const observeElements = () => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    };

    // Initial observation with a small delay for route changes
    const timeoutId = setTimeout(observeElements, 100);

    // Watch for dynamically injected .reveal elements (like ProductGrid tabs)
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldReObserve = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldReObserve = true;
          break;
        }
      }
      if (shouldReObserve) {
        observeElements();
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [showContent, pathname, searchParams]);

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
