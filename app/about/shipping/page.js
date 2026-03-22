'use client';

import styles from './Shipping.module.css';
import { Truck, RotateCcw, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Truck size={40} className={styles.icon} />
        <h1 className="brand-font">FULFILLMENT / RETURNS</h1>
        <p>Everything you need to know about how apparel ships and how the local cannabis menu is handled.</p>
      </header>

      <div className={styles.shippingGrid}>
        <div className={styles.shippingSection}>
          <div className={styles.sectionHead}>
            <MapPin size={24} />
            <h3>ORDER PROCESSING</h3>
          </div>
          <div className={styles.sectionBody}>
             <p>Orders are split clearly between nationwide apparel shipping and Bakersfield-only pickup reservations for cannabis.</p>
             <ul>
               <li><strong>Processing:</strong> Orders are usually prepared within 24-48 hours.</li>
               <li><strong>Notifications:</strong> You&apos;ll receive email updates once your order is confirmed or in motion.</li>
             </ul>
          </div>
        </div>

        <div className={styles.shippingSection}>
          <div className={styles.sectionHead}>
            <Truck size={24} />
            <h3>DOMESTIC SHIPPING</h3>
          </div>
          <div className={styles.sectionBody}>
             <p>We ship apparel and accessories nationwide across the US.</p>
             <ul>
               <li><strong>Handling:</strong> All apparel orders are processed within 24-48 hours.</li>
               <li><strong>Carrier:</strong> USPS or UPS Ground. Tracking provided via email once shipped.</li>
               <li><strong>Checkout:</strong> Shipping card payments are processed securely through Stripe.</li>
             </ul>
          </div>
        </div>

        <div className={styles.shippingSection}>
          <div className={styles.sectionHead}>
            <MapPin size={24} />
            <h3>LOCAL CANNABIS PICKUP</h3>
          </div>
          <div className={styles.sectionBody}>
             <p>The cannabis menu is separated from apparel and stays local to Bakersfield.</p>
             <ul>
               <li><strong>Age Gate:</strong> You must be 21+ to enter the local menu and reserve cannabis items.</li>
               <li><strong>Fulfillment:</strong> Cannabis reservations are for Bakersfield pickup only.</li>
               <li><strong>ID:</strong> Valid ID is required at pickup for all cannabis reservations.</li>
             </ul>
          </div>
        </div>

        <div className={styles.shippingSection}>
          <div className={styles.sectionHead}>
            <RotateCcw size={24} />
            <h3>RETURNS & EXCHANGES</h3>
          </div>
          <div className={styles.sectionBody}>
             <p>Quality matters on both sides of the business, but the return rules are different by product type.</p>
             <ul>
               <li><strong>Apparel:</strong> 14-day return window for unworn items in original packaging.</li>
               <li><strong>Cannabis:</strong> Local cannabis reservations are final once fulfilled.</li>
               <li><strong>Process:</strong> Use the Connect form to start an apparel return or exchange request.</li>
             </ul>
          </div>
        </div>

        <div className={styles.shippingSection}>
          <div className={styles.sectionHead}>
            <ShieldCheck size={24} />
            <h3>AUTHENTICITY & QUALITY</h3>
          </div>
          <div className={styles.sectionBody}>
             <p>Every item listed in the store is meant to represent the business clearly and accurately.</p>
             <ul>
               <li><strong>Guarantee:</strong> We stand behind the quality of every garment, accessory, and branded product in the store.</li>
               <li><strong>Checkout:</strong> Shipping orders use Stripe for secure online card processing, while local pickup reservations stay separate.</li>
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
