'use client';

import { useState } from 'react';
import styles from './Contact.module.css';
import { Send, CheckCircle } from 'lucide-react';
import audioEngine from '@/lib/AudioEngine';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try { audioEngine.playClick(); } catch(e){}
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    
    console.log('Lead captured for moneygrowontrees80@gmail.com:', formData);
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className="brand-font text-gradient">Connect with Home Grown Money</h1>
          <p className={styles.subtitle}>Money Grows Where We Plant It.</p>
        </div>
      </section>

      <section className={styles.contactForm}>
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            {status === 'success' ? (
              <div className={styles.successState}>
                <CheckCircle size={60} color="#00ff00" />
                <h2 className="brand-font">MESSAGE RECEIVED</h2>
                <p>We&apos;ve received your inquiry. Our team (moneygrowontrees80@gmail.com) will get back to you shortly.</p>
                <button onClick={() => setStatus('idle')} className={styles.submitBtn}>SEND ANOTHER</button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="YOUR NAME" 
                    className={styles.input} 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="YOUR EMAIL" 
                    className={styles.input} 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Message</label>
                  <textarea 
                    required
                    placeholder="WHAT'S ON YOUR MIND?" 
                    className={styles.textarea}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                  {status === 'sending' ? 'SECURING MESSAGE...' : (
                    <>SEND MESSAGE <Send size={18} style={{ marginLeft: '10px' }} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
