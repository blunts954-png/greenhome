'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    q: "How do I pay for my order?",
    a: "Orders are settled in-person at our Bakersfield location. We accept cash, Venmo, and major credit cards via our secure POS system. Order online to secure your inventory, then pay when you arrive."
  },
  {
    q: "Where is the pickup location?",
    a: "Our central hub is located in the heart of Bakersfield (130 E. 21st / 210 Goodman). Once your order is 'Ready for Pickup', you'll receive a notification with the exact details."
  },
  {
    q: "Do you offer delivery?",
    a: "Yes, we offer local delivery within legal radius limits for both apparel and cannabis (21+ only). Delivery windows are typically 10:00 AM - 10:00 PM."
  },
  {
    q: "What's the Material quality of the tees?",
    a: "We use 100% premium 6.5oz ring-spun cotton for our Logo Tees. They are slightly oversized, pre-shrunk, and built to last. Our hoodies are high-GSM fleece for maximum comfort."
  },
  {
    q: "Can I return an item?",
    a: "Apparel can be exchanged or returned for store credit within 14 days if unworn and in original packaging. Cannabis products are final sale due to compliance regulations."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <HelpCircle size={40} className={styles.icon} />
        <h1 className="brand-font">FREQUENTLY ASKED</h1>
        <p>Everything you need to know about the HGM lifestyle.</p>
      </header>

      <div className={styles.faqList}>
        {FAQS.map((faq, i) => (
          <div key={i} className={`${styles.faqItem} ${openIndex === i ? styles.open : ''}`}>
            <button onClick={() => setOpenIndex(openIndex === i ? -1 : i)} className={styles.question}>
              <span>{faq.q.toUpperCase()}</span>
              {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
            </button>
            <div className={styles.answer}>
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.faqFooter}>
        <p>Still have questions?</p>
        <Link href="/contact" className={styles.contactBtn}>CONNECT WITH US</Link>
      </footer>
    </div>
  );
}
