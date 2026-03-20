'use client';

import { useState } from 'react';
import styles from './Contact.module.css';
import { CheckCircle, ArrowLeft, Target, Briefcase, Shirt } from 'lucide-react';
import audioEngine from '@/lib/AudioEngine';

const DIRECT_EMAIL = 'moneygrowontrees80@gmail.com';

export default function ContactPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    intent: '', 
    category: '', 
    name: '', 
    email: '', 
    message: '' 
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const totalSteps = 3;
  const directEmailHref = `mailto:${DIRECT_EMAIL}?subject=${encodeURIComponent(`HGM ${formData.intent || 'Inquiry'}${formData.category ? ` - ${formData.category}` : ''}`)}&body=${encodeURIComponent(
    [
      `Name: ${formData.name || ''}`,
      `Email: ${formData.email || ''}`,
      `Intent: ${formData.intent || ''}`,
      `Category: ${formData.category || ''}`,
      '',
      formData.message || ''
    ].join('\n')
  )}`;

  const handleNext = () => {
    try { audioEngine.playClick(); } catch(e){}
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    try { audioEngine.playClick(); } catch(e){}
    setStep(prev => prev - 1);
  };

  const selectOption = (field, value) => {
    try { audioEngine.playClick(); } catch(e){}
    setFormData(prev => ({ ...prev, [field]: value }));
    handleNext();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try { audioEngine.playClick(); } catch(e){}
    
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (resp.ok) {
        setStatus('success');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      console.error('Email error:', err);
      setStatus('error');
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className={styles.quizStep}>
            <h2 className="brand-font">Step 1: Define Your Hustle</h2>
            <p className={styles.quizText}>Are you reaching out as a customer or about a business opportunity?</p>
            <div className={styles.options}>
              <button 
                className={`${styles.optionBtn} ${formData.intent === 'Customer' ? styles.active : ''}`}
                onClick={() => selectOption('intent', 'Customer')}
              >
                <Target size={40} />
                <span>CUSTOMER</span>
                <p>Order questions, merch help, or general support.</p>
              </button>
              <button 
                className={`${styles.optionBtn} ${formData.intent === 'Business' ? styles.active : ''}`}
                onClick={() => selectOption('intent', 'Business')}
              >
                <Briefcase size={40} />
                <span>BUSINESS / COLLAB</span>
                <p>Press, booking, partnerships, or wholesale.</p>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.quizStep}>
            <h2 className="brand-font">Step 2: Choose the Topic</h2>
            <p className={styles.quizText}>Tell us what the message is about so we can route it fast.</p>
            <div className={styles.options}>
              <button 
                className={`${styles.optionBtn} ${formData.category === 'Merch' ? styles.active : ''}`}
                onClick={() => selectOption('category', 'Merch')}
              >
                <Shirt size={40} />
                <span>MERCH / ORDER</span>
                <p>Store questions, shipping, sizing, and support.</p>
              </button>
              <button 
                className={`${styles.optionBtn} ${formData.category === 'Press / Booking' ? styles.active : ''}`}
                onClick={() => selectOption('category', 'Press / Booking')}
              >
                <Briefcase size={40} />
                <span>PRESS / BOOKING</span>
                <p>Features, appearances, business, and collaborations.</p>
              </button>
            </div>
            <button onClick={handleBack} className={styles.backLink}><ArrowLeft size={16}/> Back</button>
          </div>
        );
      case 3:
        return (
          <div className={styles.quizStep}>
            <h2 className="brand-font">Step 3: Establish the Connection</h2>
            <p className={styles.quizText}>Provide the coordinates for our team to reach out.</p>
            <form className={styles.finalForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="NAME"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="EMAIL"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Inquiry Details</label>
                <textarea 
                  required
                  placeholder="TELL US ABOUT THE VISION..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className={styles.textarea}
                ></textarea>
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={handleBack} className={styles.backLink}><ArrowLeft size={16}/> Back</button>
                <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                  {status === 'sending' ? 'TRANSMITTING...' : 'FINALIZE CONNECTION'}
                </button>
              </div>
              <div className={styles.directEmailBox}>
                <p>Direct inbox backup: <a href={`mailto:${DIRECT_EMAIL}`}>{DIRECT_EMAIL}</a></p>
                {status === 'error' && (
                  <a href={directEmailHref} className={styles.directEmailLink}>
                    Email Us Directly
                  </a>
                )}
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className="brand-font text-gradient">The Growth Protocol</h1>
          <p className={styles.subtitle}>Merch support, business inquiries, and label connections in one place.</p>
        </div>
      </section>

      <section className={styles.quizSection}>
        <div className={styles.container}>
          <div className={styles.progressTracker}>
            <div className={styles.progressLine} style={{ '--progress': `${(step / totalSteps) * 100}%` }}></div>
            {[1, 2, 3].map(i => (
              <div key={i} className={`${styles.stepIndicator} ${step >= i ? styles.stepActive : ''}`}>
                {i}
              </div>
            ))}
          </div>

          <div className={styles.formWrapper}>
            {status === 'success' ? (
              <div className={styles.successState}>
                <CheckCircle size={60} color="#00ff00" />
                <h2 className="brand-font">CONNECTION ESTABLISHED</h2>
                <p>Your trajectory is logged. The HGM team will respond via email shortly.</p>
                <button onClick={() => { setStep(1); setStatus('idle'); }} className={styles.submitBtn}>NEW INQUIRY</button>
              </div>
            ) : (
              renderStep()
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
