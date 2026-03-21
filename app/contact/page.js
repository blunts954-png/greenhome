'use client';

import { useState } from 'react';
import styles from './Contact.module.css';
import { Send, CheckCircle, ArrowRight, ArrowLeft, Target, Briefcase, Shirt, Sprout } from 'lucide-react';
import audioEngine from '@/lib/AudioEngine';

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
            <p className={styles.quizText}>Are you planting a single seed or preparing the whole field?</p>
            <div className={styles.options}>
              <button 
                className={`${styles.optionBtn} ${formData.intent === 'Individual' ? styles.active : ''}`}
                onClick={() => selectOption('intent', 'Individual')}
              >
                <Target size={40} />
                <span>INDIVIDUAL CUSTOMER</span>
                <p>Looking for a fresh drop.</p>
              </button>
              <button 
                className={`${styles.optionBtn} ${formData.intent === 'Wholesale' ? styles.active : ''}`}
                onClick={() => selectOption('intent', 'Wholesale')}
              >
                <Briefcase size={40} />
                <span>WHOLESALE PARTNER</span>
                <p>Bulk orders & distribution.</p>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.quizStep}>
            <h2 className="brand-font">Step 2: Choose Your Product Root</h2>
            <p className={styles.quizText}>Where do you want the money to grow?</p>
            <div className={styles.options}>
              <button 
                className={`${styles.optionBtn} ${formData.category === 'Apparel' ? styles.active : ''}`}
                onClick={() => selectOption('category', 'Apparel')}
              >
                <Shirt size={40} />
                <span>HGM APPAREL</span>
                <p>Streetwear & Heritage gear.</p>
              </button>
              <button 
                className={`${styles.optionBtn} ${formData.category === 'Cannabis' ? styles.active : ''}`}
                onClick={() => selectOption('category', 'Cannabis')}
              >
                <Sprout size={40} />
                <span>PREMIUM CANNABIS</span>
                <p>Vape, Flower, and Extracts.</p>
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
          <p className={styles.subtitle}>Money grows where we plant it. Let&apos;s map your trajectory.</p>
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
