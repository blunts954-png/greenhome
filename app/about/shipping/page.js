'use client';

import styles from './Shipping.module.css';
import { Truck, RotateCcw, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Truck size={40} className={styles.icon} />
        <h1 className="brand-font">SHIPPING / RETURNS / PICKUPS</h1>
        <p>Logistics for the Bakersfield elite.</p>
      </header>

      <div className={styles.shippingGrid}>
        <div className={styles.shippingSection}>
          <div className={styles.sectionHead}>
            <MapPin size={24} />
            <h3>LOCAL PICKUP & DELIVERY</h3>
          </div>
          <div className={styles.sectionBody}>
             <p>Our Bakersfield hub serves as the primary distribution point for all HGM gear and cannabis products.</p>
             <ul>
               <li><strong>Pickup:</strong> Select pickup during checkout and we&apos;ll follow up with Bakersfield handoff details once the order is confirmed.</li>
               <li><strong>Delivery:</strong> Local delivery is available for eligible Bakersfield-area orders, including age-gated local menu items where permitted.</li>
             </ul>
          </div>
        </div>

        <div className={styles.shippingSection}>
          <div className={styles.sectionHead}>
            <Truck size={24} />
            <h3>DOMESTIC SHIPPING</h3>
          </div>
          <div className={styles.sectionBody}>
             <p>We ship Apparel and Accessories nationwide across the US.</p>
             <ul>
               <li><strong>Handling:</strong> All orders processed within 24-48 hours. Items drop every Friday.</li>
               <li><strong>Carrier:</strong> USPS or UPS Ground. Tracking provided via email once shipped.</li>
               <li><strong>Restriction:</strong> Cannabis products cannot be shipped. They remain limited to local pickup or local delivery only.</li>
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
             <p>Every piece is a testament to the power of persistence.</p>
             <ul>
               <li><strong>Guarantee:</strong> We stand behind the quality of every screen-print and every flower batch.</li>
               <li><strong>Compliance:</strong> All cannabis operations strictly follow local Bakersfield and CA guidelines. 21+ ID required for all pickups and deliveries.</li>
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
