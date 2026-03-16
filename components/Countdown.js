'use client';

import { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date (e.g., 5 days from now for demonstration)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 4);
    targetDate.setHours(targetDate.getHours() + 12);
    targetDate.setMinutes(targetDate.getMinutes() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div className={styles.countdown}>
      <div className={styles.countItem}>
        <span>{formatNumber(timeLeft.days)}</span>
        <label>DAYS</label>
      </div>
      <div className={styles.countItem}>
        <span>{formatNumber(timeLeft.hours)}</span>
        <label>HOURS</label>
      </div>
      <div className={styles.countItem}>
        <span>{formatNumber(timeLeft.minutes)}</span>
        <label>MINS</label>
      </div>
      <div className={styles.countItem}>
        <span>{formatNumber(timeLeft.seconds)}</span>
        <label>SECS</label>
      </div>
    </div>
  );
}
