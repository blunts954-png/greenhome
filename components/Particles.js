'use client';

import { useEffect, useRef } from 'react';
import styles from './Particles.module.css';

export default function Particles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = 20;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = styles.particle;
      
      // Randomize starting position
      const x = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = 10 + Math.random() * 15;
      const size = 15 + Math.random() * 25;

      particle.style.left = `${x}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Randomly choose between a "money" or "leaf" glow
      if (Math.random() > 0.5) {
        particle.classList.add(styles.money);
      } else {
        particle.classList.add(styles.leaf);
      }

      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return <div ref={containerRef} className={styles.container}></div>;
}
