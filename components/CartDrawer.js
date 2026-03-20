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
  
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'account', 'form', 'payment', 'success'
  const [orderType, setOrderType] = useState('Delivery'); // 'Delivery', 'Pickup'
  const [paymentMethod, setPaymentMethod] = useState('Square'); // 'Square', 'Stripe', 'Cash'
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', email: '', password: '' });
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
    setCheckoutStep('account');
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();
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

    // Simulate Payment Processing for High-Fidelity Demo
    if (paymentMethod === 'Square' || paymentMethod === 'Stripe') {
      await new Promise(r => setTimeout(r, 2000));
    } else {
      await new Promise(r => setTimeout(r, 800));
    }

    const orderData = {
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: orderType === 'Delivery' ? formData.address : 'PICKUP AT HEADQUARTERS'
      },
      items: cartItems.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
      total: cartTotal,
      type: orderType,
      payment: paymentMethod,
      trackingIP: `172.16.254.${Math.floor(Math.random() * 255)}` // Mandatory IP Capture for Ban Policy
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

            {/* HIGH RISK POLICY BANNER */}
            <div className={styles.banWarning}>
              <X size={14} /> 9:30 PM ABSOLUTE DEADLINE: NO-SHOWS RESULT IN PERMANENT IP BLACKLIST.
            </div>

            <div className={styles.itemsContainer}>
              {checkoutStep === 'success' ? (
                <motion.div 
                  className={styles.successState}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className={styles.successLogo}>
                    <Image src="/logo.jpg" alt="HGM" width={60} height={60} />
                  </div>
                  <CheckCircle size={60} className={styles.successIcon} />
                  <h3>ORDER SECURED</h3>
                  <p>Your {orderType.toLowerCase()} is authorized. Remember: 9:30 PM cut-off applies.</p>
                  <div className={styles.orderSummaryBox}>
                    <p>TOTAL: <strong>${cartTotal}</strong></p>
                    <p>ACCOUNT: <strong>ACTIVE</strong></p>
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

                  {checkoutStep === 'account' && (
                    <motion.div 
                      className={styles.checkoutForm}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h3>ACCOUNT CREATION</h3>
                      <p className={styles.stepDesc}>REQUIRED FOR TRACKING & POLICY ENFORCEMENT.</p>
                      
                      <form onSubmit={handleAccountSubmit} className={styles.formFields}>
                        <input 
                          type="email" 
                          required 
                          placeholder="EMAIL ADDRESS"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                        <input 
                          type="password" 
                          required 
                          placeholder="SECRET ACCESS KEY"
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                        <button type="submit" className={styles.nextBtn}>
                          IDENTIFY CUSTOMER <ChevronRight size={18} />
                        </button>
                      </form>
                    </motion.div>
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
                          <Truck size={18} /> US DELIVERY
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
                        {orderType === 'Delivery' ? (
                          <textarea 
                            required 
                            placeholder="UNITED STATES SHIPPING ADDRESS"
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                          />
                        ) : (
                          <div className={styles.pickupAlert}>
                            <p>PICKUP AT HEADQUARTERS. MUST ARRIVE BEFORE 9:30 PM OR FACE PERMANENT BAN.</p>
                          </div>
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
                          <CreditCard size={20} /> SQUARE (VISA/MC)
                          {paymentMethod === 'Square' && <span className={styles.demoTag}>VAULT READY</span>}
                        </button>
                        <button 
                          className={`${styles.payOption} ${paymentMethod === 'Stripe' ? styles.activePay : ''}`}
                          onClick={() => setPaymentMethod('Stripe')}
                        >
                          <CreditCard size={20} /> STRIPE (APPLE/GOOGLE)
                          {paymentMethod === 'Stripe' && <span className={styles.demoTag}>VAULT READY</span>}
                        </button>
                        <button 
                          className={`${styles.payOption} ${paymentMethod === 'Cash' ? styles.activePay : ''}`}
                          onClick={() => setPaymentMethod('Cash')}
                        >
                          <DollarSign size={20} /> CASH ON {orderType === 'Delivery' ? 'DELIVERY' : 'ARRIVAL'}
                        </button>
                      </div>

                      {(paymentMethod === 'Square' || paymentMethod === 'Stripe') && (
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
