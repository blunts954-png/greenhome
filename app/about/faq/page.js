'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    q: "How do I pay for my order?",
    a: "Apparel shipping orders are set up for Stripe card checkout. Local pickup and delivery orders can be arranged with cash or card depending on the fulfillment type."
  },
  {
    q: "How long does shipping take?",
    a: "Apparel orders are typically processed in 24-48 hours. Tracking is sent by email once the package is on the way."
  },
  {
    q: "Can cannabis be shipped?",
    a: "No. The cannabis menu is 21+ and limited to Bakersfield pickup or delivery."
  },
  {
    q: "How does the split menu work?",
    a: "Apparel and accessories can ship nationwide or be fulfilled locally. Flower, concentrates, edibles, disposables, and pre-rolls stay behind the 21+ Bakersfield local menu."
  },
  {
    q: "Can I return an item?",
    a: "Unworn apparel can be reviewed for exchange or store credit after contact. Cannabis reservations are final once fulfilled."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <HelpCircle size={40} className={styles.icon} />
        <h1 className="brand-font">FREQUENTLY ASKED</h1>
        <p>Everything you need to know about the apparel store, the local menu, and Bakersfield fulfillment rules.</p>
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
