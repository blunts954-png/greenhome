'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { X, Trash2, ShoppingBag, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import audioEngine from '@/lib/AudioEngine';
import styles from './CartDrawer.module.css';

// Heavy, brutally physical spring settings
const springPhysics = {
  type: "spring",
  mass: 1.2, // Heavy
  stiffness: 250, // High tension
  damping: 30 // Minimal bounce
};

export default function CartDrawer() {
  const { cartItems, cartTotal, isDrawerOpen, toggleDrawer, removeFromCart, clearCart } = useCart();
  
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'form', 'success'
  const [formData, setFormData] = useState({ name: '', contact: '' });

  // Reset state when drawer closes
  useEffect(() => {
    if (!isDrawerOpen) {
      setTimeout(() => setCheckoutStep('cart'), 300);
    }
  }, [isDrawerOpen]);

  // Trigger auditory feedback when drawer opens/closes
  useEffect(() => {
    if (isDrawerOpen) {
      audioEngine.playClick();
    }
  }, [isDrawerOpen]);

  // Intercept the close action to play the click sound
  const handleClose = () => {
    audioEngine.playClick();
    toggleDrawer();
  };

  const handleRemove = (id, size) => {
    audioEngine.playClick();
    removeFromCart(id, size);
  };

  const handleCheckoutInit = () => {
    audioEngine.playClick();
    setCheckoutStep('form');
  };

  const handleReserveSubmit = (e) => {
    e.preventDefault();
    audioEngine.playClick();
    // In a real app, send `cartItems` and `formData` to a backend or webhook here.
    
    setCheckoutStep('success');
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div 
          className={styles.overlay} 
          onClick={handleClose}
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(5px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className={styles.drawer} 
            onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={springPhysics}
          >
            <div className={styles.header}>
              <div className={styles.titleGroup}>
                <ShoppingBag size={20} className={styles.titleIcon} />
                <h2 className="brand-font">The Vault</h2>
              </div>
              <button className={styles.closeBtn} onClick={handleClose}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.itemsContainer}>
              {checkoutStep === 'success' ? (
                <motion.div 
                  className={styles.successState}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={springPhysics}
                >
                  <CheckCircle size={60} className={styles.successIcon} />
                  <h3>Locked In.</h3>
                  <p>Your order is reserved for in-store pickup.</p>
                  <p className={styles.cashNotice}><strong>Payment required:</strong> Cash on Arrival.</p>
                  <button className={styles.continueShop} onClick={handleClose}>Close Vault</button>
                </motion.div>
              ) : cartItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Your vault is currently empty.</p>
                  <button className={styles.continueShop} onClick={handleClose}>
                    Enter the Store
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {checkoutStep === 'cart' && cartItems.map((item) => (
                    <motion.div 
                      key={`${item.id}-${item.selectedSize}`} 
                      className={styles.cartItem}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                      layout
                    >
                      <div className={styles.itemImg}>
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className={styles.itemMeta}>
                        <h3>{item.name}</h3>
                        <p className={styles.sizeInfo}>Size: {item.selectedSize}</p>
                        <p className={styles.quantity}>Qty: {item.quantity}</p>
                        <p className={styles.price}>${item.price * item.quantity}</p>
                      </div>
                      <button 
                        className={styles.removeBtn} 
                        onClick={() => handleRemove(item.id, item.selectedSize)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}

                  {checkoutStep === 'form' && (
                    <motion.form 
                      className={styles.checkoutForm}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleReserveSubmit}
                    >
                      <h3>Reserve for Pickup</h3>
                      <p className={styles.disclaimer}>HGM operates primarily in physical space. Reserve your gear now and pay cash at the door.</p>
                      
                      <div className={styles.inputGroup}>
                        <label>Name / Alias</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="Who is picking this up?"
                        />
                      </div>
                      
                      <div className={styles.inputGroup}>
                        <label>Contact (Email or Phone)</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.contact}
                          onChange={e => setFormData({...formData, contact: e.target.value})}
                          placeholder="How do we reach you?"
                        />
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              )}
            </div>

            {cartItems.length > 0 && checkoutStep !== 'success' && (
              <motion.div 
                className={styles.footer}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, ...springPhysics }}
              >
                <div className={styles.totalRow}>
                  <span>Total (Cash)</span>
                  <span className={styles.totalAmount}>${cartTotal}</span>
                </div>
                
                {checkoutStep === 'cart' ? (
                  <>
                    <p className={styles.shippingNotice}>In-store Pickup Only. Cash on Arrival.</p>
                    <motion.button 
                      className={styles.checkoutBtn}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckoutInit}
                    >
                      Lock In Order
                    </motion.button>
                  </>
                ) : (
                  <motion.button 
                    className={styles.reserveBtn}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReserveSubmit}
                  >
                    Confirm Reservation
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
