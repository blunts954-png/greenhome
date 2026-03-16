'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { useOrders } from '@/lib/orders-context';
import { X, Trash2, ShoppingBag, CheckCircle, Truck, Package, CreditCard, ChevronRight, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import audioEngine from '@/lib/AudioEngine';
import styles from './CartDrawer.module.css';

const springPhysics = {
  type: "spring",
  mass: 1.2,
  stiffness: 250,
  damping: 30
};

export default function CartDrawer() {
  const cartContext = useCart();
  const { cartItems = [], cartTotal = 0, isDrawerOpen = false, toggleDrawer = () => {}, removeFromCart = () => {}, clearCart = () => {} } = cartContext || {};
  
  const ordersContext = useOrders();
  const { addOrder = () => {} } = ordersContext || {};
  
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'form', 'payment', 'success'
  const [orderType, setOrderType] = useState('Delivery'); // 'Delivery', 'Pickup'
  const [paymentMethod, setPaymentMethod] = useState('Square'); // 'Square', 'Cash'
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isDrawerOpen) {
      setTimeout(() => setCheckoutStep('cart'), 300);
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen) {
      audioEngine.playClick();
    }
  }, [isDrawerOpen]);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    audioEngine.playClick();
    setCheckoutStep('payment');
  };

  const handleFinalSubmit = async () => {
    audioEngine.playClick();
    setIsProcessing(true);

    // Simulate Payment Processing for Square Demo
    if (paymentMethod === 'Square') {
      await new Promise(r => setTimeout(r, 2000));
    } else {
      await new Promise(r => setTimeout(r, 800));
    }

    const orderData = {
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: orderType === 'Delivery' ? formData.address : 'PICKUP AT STORE'
      },
      items: cartItems.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
      total: cartTotal,
      type: orderType,
      payment: paymentMethod
    };

    addOrder(orderData);
    setIsProcessing(false);
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
                <h2 className="brand-font">SECURE VAULT</h2>
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
                >
                  <CheckCircle size={60} className={styles.successIcon} />
                  <h3>ORDER SECURED</h3>
                  <p>Your {orderType.toLowerCase()} is being prepared.</p>
                  <div className={styles.orderSummaryBox}>
                    <p>TOTAL: <strong>${cartTotal}</strong></p>
                    <p>STATUS: <strong>PENDING</strong></p>
                  </div>
                  <button className={styles.continueShop} onClick={handleClose}>RETURN TO STORE</button>
                </motion.div>
              ) : cartItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>VAULT IS CURRENTLY EMPTY.</p>
                  <button className={styles.continueShop} onClick={handleClose}>
                    VIEW CATALOG
                  </button>
                </div>
              ) : (
                <>
                  {checkoutStep === 'cart' && (
                    <div className={styles.cartList}>
                      {cartItems.map((item) => (
                        <div key={`${item.id}-${item.selectedSize}`} className={styles.cartItem}>
                          <div className={styles.itemImg}>
                            <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                          </div>
                          <div className={styles.itemMeta}>
                            <h3>{item.name}</h3>
                            {item.selectedSize && <p className={styles.sizeInfo}>SIZE: {item.selectedSize}</p>}
                            <p className={styles.price}>${item.price} x {item.quantity}</p>
                          </div>
                          <button className={styles.removeBtn} onClick={() => handleRemove(item.id, item.selectedSize)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {checkoutStep === 'form' && (
                    <motion.div 
                      className={styles.checkoutForm}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h3>LOGISTICS</h3>
                      
                      <div className={styles.typeToggle}>
                        <button 
                          className={`${styles.typeBtn} ${orderType === 'Delivery' ? styles.activeType : ''}`}
                          onClick={() => setOrderType('Delivery')}
                        >
                          <Truck size={18} /> DELIVERY
                        </button>
                        <button 
                          className={`${styles.typeBtn} ${orderType === 'Pickup' ? styles.activeType : ''}`}
                          onClick={() => setOrderType('Pickup')}
                        >
                          <Package size={18} /> PICKUP
                        </button>
                      </div>

                      <form onSubmit={handleFormSubmit} className={styles.formFields}>
                        <input 
                          type="text" 
                          required 
                          placeholder="FULL NAME"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                        <input 
                          type="tel" 
                          required 
                          placeholder="MOBILE NUMBER"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                        {orderType === 'Delivery' && (
                          <textarea 
                            required 
                            placeholder="BAKERSFIELD DELIVERY ADDRESS"
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                          />
                        )}
                        <button type="submit" className={styles.nextBtn}>
                          PROCEED TO PAYMENT <ChevronRight size={18} />
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {checkoutStep === 'payment' && (
                    <motion.div 
                      className={styles.paymentContainer}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h3>SECURE PAYMENT</h3>
                      <div className={styles.paymentOptions}>
                        <button 
                          className={`${styles.payOption} ${paymentMethod === 'Square' ? styles.activePay : ''}`}
                          onClick={() => setPaymentMethod('Square')}
                        >
                          <CreditCard size={20} /> SQUARE (CREDIT/DEBIT)
                          {paymentMethod === 'Square' && <span className={styles.demoTag}>DEMO MODE</span>}
                        </button>
                        <button 
                          className={`${styles.payOption} ${paymentMethod === 'Cash' ? styles.activePay : ''}`}
                          onClick={() => setPaymentMethod('Cash')}
                        >
                          <DollarSign size={20} /> CASH ON {orderType === 'Delivery' ? 'DELIVERY' : 'ARRIVAL'}
                        </button>
                      </div>

                      {paymentMethod === 'Square' && (
                        <div className={styles.squareDemo}>
                          <div className={styles.squareCard}>
                            <div className={styles.cardHeader}>SQUARE CHECKOUT</div>
                            <div className={styles.mockFields}>
                              <div className={styles.mockInput}>•••• •••• •••• 4242</div>
                              <div className={styles.mockRow}>
                                <div className={styles.mockInput}>MM/YY</div>
                                <div className={styles.mockInput}>CVC</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <button 
                        className={styles.finalSubmitBtn} 
                        disabled={isProcessing}
                        onClick={handleFinalSubmit}
                      >
                        {isProcessing ? 'PROCESSING...' : `PAY $${cartTotal}`}
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {cartItems.length > 0 && checkoutStep === 'cart' && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span>SUBTOTAL</span>
                  <span className={styles.totalAmount}>${cartTotal}</span>
                </div>
                <button className={styles.checkoutBtn} onClick={handleCheckoutInit}>
                  PROCEED TO LOGISTICS
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
