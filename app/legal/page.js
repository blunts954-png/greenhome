'use client';

import Link from 'next/link';
import styles from './legal.module.css';

export default function LegalPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="brand-font italic">HGM LEGAL DISCLOSURE</h1>
        <p>HOME GROWN MONEY: EST. BAKERSFIELD, CA</p>
      </header>

      <section className={styles.section}>
        <h2 className="brand-font">1. CANNABIS PRODUCT POLICY</h2>
        <p>
          Home Grown Money (HGM) operates in compliance with California state laws regarding the sale and distribution of cannabis and cannabis-infused products. 
          All cannabis products listed on this website are strictly for reservation and pickup or local delivery within the Bakersfield area.
        </p>
        <ul className={styles.list}>
          <li><strong>Age Requirement:</strong> You must be 21 years of age or older (or 18+ with a valid medical recommendation) to view the cannabis menu or reserve products.</li>
          <li><strong>No Shipping:</strong> Under federal and state law, cannabis products CANNOT be shipped via mail or any common carrier (USPS, FedEx, UPS).</li>
          <li><strong>ID Verification:</strong> A valid government-issued ID is MANDATORY at the time of fulfillment. No ID, No HGM.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className="brand-font">2. APPAREL & ACCESSORIES</h2>
        <p>
          HGM Apparel and Smoking Accessories (Trays, Grinders, Glassware, etc.) are available for nationwide shipping through our secure Stripe-enabled checkout. 
          Standard shipping rates apply and are calculated at checkout.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className="brand-font">3. REFUND & RETURN POLICY</h2>
        <p>
          Due to the nature of our products, all cannabis sales are final. 
          Apparel items may be exchanged within 14 days of receipt if in original, unworn condition. 
          Digital goods and some accessory items are non-refundable.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className="brand-font">4. &quot;HOME GROWN&quot; MISSION</h2>
        <p>
          Everything we do is built on the foundation of the Bakersfield community. 
          We are not a corporate chain; we are locally rooted, 100% authentic, and committed to providing the highest grade product 
          with the same level of care that we put into our brand.
        </p>
      </section>

      <footer className={styles.footer}>
        <Link href="/shop" className={styles.backBtn}>BACK TO THE MENU</Link>
        <p className={styles.contact}>FOR LEGAL INQUIRIES OR VERIFICATION: <strong>MONEYGROWONTREES80@GMAIL.COM</strong></p>
      </footer>
    </div>
  );
}
