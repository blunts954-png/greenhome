'use client';

import styles from './Shipping.module.css';
import { Truck, RotateCcw, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Truck size={40} className={styles.icon} />
        <h1 className="brand-font">SHIPPING / RETURNS</h1>
        <p>Everything you need to know about how merch moves.</p>
      </header>

      <div className={styles.shippingGrid}>
        <div className={styles.shippingSection}>
          <div className={styles.sectionHead}>
            <MapPin size={24} />
            <h3>ORDER PROCESSING</h3>
          </div>
          <div className={styles.sectionBody}>
             <p>Orders move through a simple shipping-only flow from checkout to delivery.</p>
             <ul>
               <li><strong>Processing:</strong> Orders are usually prepared within 24-48 hours.</li>
               <li><strong>Notifications:</strong> You&apos;ll receive shipping updates by email once the order is in motion.</li>
             </ul>
          </div>
        </div>

        <div className={styles.shippingSection}>
          <div className={styles.sectionHead}>
            <Truck size={24} />
            <h3>DOMESTIC SHIPPING</h3>
          </div>
          <div className={styles.sectionBody}>
             <p>We ship merch and accessories nationwide across the US.</p>
             <ul>
               <li><strong>Handling:</strong> All orders processed within 24-48 hours. Items drop every Friday.</li>
               <li><strong>Carrier:</strong> USPS or UPS Ground. Tracking provided via email once shipped.</li>
               <li><strong>Checkout:</strong> Shipping card payments are processed securely through Stripe.</li>
             </ul>
          </div>
        </div>

        <div className={styles.shippingSection}>
          <div className={styles.sectionHead}>
            <RotateCcw size={24} />
            <h3>RETURNS & EXCHANGES</h3>
          </div>
          <div className={styles.sectionBody}>
             <p>Quality is the root of our heritage. If it&apos;s not perfect, we&apos;ll fix it.</p>
             <ul>
               <li><strong>Apparel:</strong> 14-day return window for unworn items in original packaging.</li>
               <li><strong>Process:</strong> Use the Connect form to start a return or exchange request.</li>
               <li><strong>Exchanges:</strong> Free for size swaps where inventory is available.</li>
             </ul>
          </div>
        </div>

        <div className={styles.shippingSection}>
          <div className={styles.sectionHead}>
            <ShieldCheck size={24} />
            <h3>AUTHENTICITY & QUALITY</h3>
          </div>
          <div className={styles.sectionBody}>
             <p>Every piece is part of a real release cycle and built to represent the brand properly.</p>
             <ul>
               <li><strong>Guarantee:</strong> We stand behind the quality of every screen-print, garment, and accessory in the store.</li>
               <li><strong>Checkout:</strong> Shipping orders use Stripe for secure online card processing.</li>
             </ul>
          </div>
        </div>
      </div>

      <div className={styles.shippingFooter}>
        <Link href="/contact" className={styles.contactBtn}>QUESTIONS? CONNECT WITH US</Link>
      </div>
    </div>
  );
}
