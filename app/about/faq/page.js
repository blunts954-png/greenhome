'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    q: "How do I pay for my order?",
    a: "Orders are reserved online. Payment is collected at pickup or local delivery, where we currently accept cash, Venmo, and card."
  },
  {
    q: "Where is the pickup location?",
    a: "Pickup arrangements are coordinated in Bakersfield after order confirmation. You’ll receive the final details directly when your order is ready."
  },
  {
    q: "Do you offer delivery?",
    a: "We offer local delivery for eligible Bakersfield orders. Apparel can also ship nationwide, but local menu items remain limited to pickup or local delivery."
  },
  {
    q: "What's the Material quality of the tees?",
    a: "Our live tee drop uses premium cotton blanks with the Money Tree front graphic and a clean standard fit built for everyday wear."
  },
  {
    q: "Can I return an item?",
    a: "Unworn apparel can be reviewed for exchange or store credit after contact. Cannabis items remain final sale due to local compliance limits."
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
