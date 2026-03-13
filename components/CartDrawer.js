'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { X, Trash2, ShoppingBag } from 'lucide-react';
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
  const { cartItems, cartTotal, isDrawerOpen, toggleDrawer, removeFromCart } = useCart();

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
                <h2 className="brand-font">Your Bag</h2>
              </div>
              <button className={styles.closeBtn} onClick={handleClose}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.itemsContainer}>
              {cartItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Your vault is currently empty.</p>
                  <button className={styles.continueShop} onClick={handleClose}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {cartItems.map((item) => (
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
                </AnimatePresence>
              )}
            </div>

            {cartItems.length > 0 && (
              <motion.div 
                className={styles.footer}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, ...springPhysics }}
              >
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span className={styles.totalAmount}>${cartTotal}</span>
                </div>
                <p className={styles.shippingNotice}>Shipping & taxes calculated at checkout</p>
                <motion.button 
                  className={styles.checkoutBtn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => audioEngine.playClick()}
                >
                  Proceed to Checkout
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
