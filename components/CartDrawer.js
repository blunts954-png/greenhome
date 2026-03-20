'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useOrders } from '@/lib/orders-context';
import { X, Trash2, ShoppingBag, CheckCircle, Truck, Package, CreditCard, ChevronRight, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import audioEngine from '@/lib/AudioEngine';
import styles from './CartDrawer.module.css';

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
  payment: 'Card'
};

const springPhysics = {
  type: 'spring',
  mass: 1.2,
  stiffness: 250,
  damping: 30
};

export default function CartDrawer() {
  const cartContext = useCart();
  const { cartItems = [], cartTotal = 0, isDrawerOpen = false, toggleDrawer = () => {}, removeFromCart = () => {}, clearCart = () => {} } = cartContext || {};

  const ordersContext = useOrders();
  const { addOrder = () => null } = ordersContext || {};

  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [orderType, setOrderType] = useState('Shipping');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isProcessing, setIsProcessing] = useState(false);

  const hasLocalOnlyItems = useMemo(
    () => cartItems.some((item) => item.pickupOnly),
    [cartItems]
  );

  const fulfillmentOptions = useMemo(
    () => (hasLocalOnlyItems ? ['Pickup', 'Local Delivery'] : ['Shipping', 'Pickup']),
    [hasLocalOnlyItems]
  );

  useEffect(() => {
    if (!fulfillmentOptions.includes(orderType)) {
      setOrderType(fulfillmentOptions[0] || 'Pickup');
    }
  }, [fulfillmentOptions, orderType]);

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
    setCheckoutStep('contact');
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    audioEngine.playClick();
    setCheckoutStep('fulfillment');
  };

  const handleFulfillmentSubmit = (event) => {
    event.preventDefault();

    if (orderType !== 'Pickup' && !formData.address.trim()) {
      return;
    }

    audioEngine.playClick();
    setCheckoutStep('review');
  };

  const handleFinalSubmit = async () => {
    audioEngine.playClick();
    setIsProcessing(true);

    const orderData = {
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: orderType === 'Pickup' ? 'Pickup arranged in Bakersfield' : formData.address.trim(),
        notes: formData.notes.trim()
      },
      items: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize || null
      })),
      total: cartTotal,
      type: orderType,
      payment: formData.payment
    };

    const newOrder = addOrder(orderData);

    if (newOrder) {
      try {
        await fetch('/api/order-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: newOrder.id,
            customerName: newOrder.customer.name,
            customerEmail: newOrder.customer.email,
            total: newOrder.total,
            type: newOrder.type,
            items: newOrder.items
          })
        });
      } catch (error) {
        console.error('Order alert request failed:', error);
      }
    }

    setIsProcessing(false);
    setCheckoutStep('success');

    setTimeout(() => {
      clearCart();
      setFormData(INITIAL_FORM);
      setOrderType(hasLocalOnlyItems ? 'Pickup' : 'Shipping');
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
            onClick={(event) => event.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={springPhysics}
          >
            <div className={styles.header}>
              <div className={styles.titleGroup}>
                <ShoppingBag size={20} className={styles.titleIcon} />
                <h2 className="brand-font">Your Order</h2>
              </div>
              <button className={styles.closeBtn} onClick={handleClose} aria-label="Close cart">
                <X size={24} />
              </button>
            </div>

            <div className={styles.statusBar}>
              <span className={checkoutStep === 'cart' ? styles.activeStep : ''}>Cart</span>
              <span className={checkoutStep === 'contact' ? styles.activeStep : ''}>Contact</span>
              <span className={checkoutStep === 'fulfillment' ? styles.activeStep : ''}>Fulfillment</span>
              <span className={checkoutStep === 'review' ? styles.activeStep : ''}>Review</span>
            </div>

            <div className={styles.itemsContainer}>
              {checkoutStep === 'success' ? (
                <motion.div
                  className={styles.successState}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className={styles.successLogo}>
                    <Image src="/logo_v3.jpg" alt="HGM" width={52} height={52} />
                  </div>
                  <CheckCircle size={60} className={styles.successIcon} />
                  <h3>Order Reserved</h3>
                  <p>Your order details were captured successfully. We&apos;ll follow up using the contact information you provided.</p>
                  <div className={styles.orderSummaryBox}>
                    <p>Total: <strong>${cartTotal}</strong></p>
                    <p>Fulfillment: <strong>{orderType}</strong></p>
                    <p>Payment: <strong>{formData.payment}</strong></p>
                  </div>
                  <button className={styles.continueShop} onClick={handleClose}>Continue Shopping</button>
                </motion.div>
              ) : cartItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Your cart is empty.</p>
                  <button className={styles.continueShop} onClick={handleClose}>
                    View Catalog
                  </button>
                </div>
              ) : (
                <>
                  {checkoutStep === 'cart' && (
                    <div className={styles.cartList}>
                      {cartItems.map((item) => (
                        <div key={`${item.id}-${item.selectedSize || 'na'}`} className={styles.cartItem}>
                          <div className={styles.itemImg}>
                            <Image src={item.image} alt={item.name} fill style={{ objectFit: item.storeSection === 'apparel' ? 'contain' : 'cover' }} />
                          </div>
                          <div className={styles.itemMeta}>
                            <h3>{item.name}</h3>
                            {item.selectedSize && <p className={styles.sizeInfo}>Size: {item.selectedSize}</p>}
                            <p className={styles.price}>${item.price} x {item.quantity}</p>
                            <p className={styles.fulfillmentTag}>{item.pickupOnly ? 'Local only' : 'Ships or pickup'}</p>
                          </div>
                          <button className={styles.removeBtn} onClick={() => handleRemove(item.id, item.selectedSize)} aria-label={`Remove ${item.name}`}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {checkoutStep === 'contact' && (
                    <motion.div
                      className={styles.checkoutForm}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h3>Contact Details</h3>
                      <p className={styles.stepDesc}>We need your name, phone, and email to confirm the reservation.</p>

                      <form onSubmit={handleContactSubmit} className={styles.formFields}>
                        <label className={styles.fieldLabel}>
                          <span><Mail size={14} /> Name</span>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                          />
                        </label>
                        <label className={styles.fieldLabel}>
                          <span><Phone size={14} /> Phone</span>
                          <input
                            type="tel"
                            required
                            placeholder="Mobile Number"
                            value={formData.phone}
                            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                          />
                        </label>
                        <label className={styles.fieldLabel}>
                          <span><Mail size={14} /> Email</span>
                          <input
                            type="email"
                            required
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                          />
                        </label>
                        <button type="submit" className={styles.nextBtn}>
                          Choose Fulfillment <ChevronRight size={18} />
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {checkoutStep === 'fulfillment' && (
                    <motion.div
                      className={styles.checkoutForm}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h3>Fulfillment & Payment</h3>
                      <p className={styles.stepDesc}>
                        {hasLocalOnlyItems
                          ? 'Your cart includes local-only items, so shipping is disabled.'
                          : 'Choose shipping or Bakersfield pickup, then select how you plan to pay.'}
                      </p>

                      <div className={styles.typeToggle}>
                        {fulfillmentOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`${styles.typeBtn} ${orderType === option ? styles.activeType : ''}`}
                            onClick={() => setOrderType(option)}
                          >
                            {option === 'Pickup' ? <Package size={18} /> : <Truck size={18} />}
                            {option}
                          </button>
                        ))}
                      </div>

                      <form onSubmit={handleFulfillmentSubmit} className={styles.formFields}>
                        {orderType !== 'Pickup' ? (
                          <label className={styles.fieldLabel}>
                            <span><MapPin size={14} /> {orderType === 'Shipping' ? 'Shipping Address' : 'Delivery Address'}</span>
                            <textarea
                              required
                              placeholder={orderType === 'Shipping' ? 'Enter shipping address' : 'Enter Bakersfield delivery address'}
                              value={formData.address}
                              onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                            />
                          </label>
                        ) : (
                          <div className={styles.pickupAlert}>
                            <p>Pickup orders are arranged in Bakersfield after confirmation. Bring valid ID for age-gated items.</p>
                          </div>
                        )}

                        <label className={styles.fieldLabel}>
                          <span><CreditCard size={14} /> Payment Method</span>
                          <div className={styles.paymentOptions}>
                            {[
                              'Card',
                              'Cash',
                              'Venmo'
                            ].map((method) => (
                              <button
                                key={method}
                                type="button"
                                className={`${styles.payOption} ${formData.payment === method ? styles.activePay : ''}`}
                                onClick={() => setFormData({ ...formData, payment: method })}
                              >
                                {method === 'Card' ? 'Card at pickup/delivery' : method}
                              </button>
                            ))}
                          </div>
                        </label>

                        <label className={styles.fieldLabel}>
                          <span><MessageSquare size={14} /> Notes</span>
                          <textarea
                            placeholder="Add preferred pickup timing, tee color request, or other order notes"
                            value={formData.notes}
                            onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                          />
                        </label>

                        <button type="submit" className={styles.nextBtn}>
                          Review Order <ChevronRight size={18} />
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {checkoutStep === 'review' && (
                    <motion.div
                      className={styles.reviewContainer}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h3>Review</h3>
                      <div className={styles.reviewCard}>
                        <p><span>Name</span><strong>{formData.name}</strong></p>
                        <p><span>Phone</span><strong>{formData.phone}</strong></p>
                        <p><span>Email</span><strong>{formData.email}</strong></p>
                        <p><span>Fulfillment</span><strong>{orderType}</strong></p>
                        <p><span>Payment</span><strong>{formData.payment === 'Card' ? 'Card at fulfillment' : formData.payment}</strong></p>
                        {(orderType !== 'Pickup') && <p><span>Address</span><strong>{formData.address}</strong></p>}
                        {formData.notes && <p><span>Notes</span><strong>{formData.notes}</strong></p>}
                      </div>

                      <div className={styles.reviewItems}>
                        {cartItems.map((item) => (
                          <div key={`${item.id}-${item.selectedSize || 'na'}-review`} className={styles.reviewItem}>
                            <span>{item.name}{item.selectedSize ? ` (${item.selectedSize})` : ''}</span>
                            <strong>${item.price * item.quantity}</strong>
                          </div>
                        ))}
                      </div>

                      <button
                        className={styles.finalSubmitBtn}
                        disabled={isProcessing}
                        onClick={handleFinalSubmit}
                      >
                        {isProcessing ? 'Submitting...' : `Submit Order • $${cartTotal}`}
                      </button>
                      <p className={styles.submitNote}>Card payments are collected at pickup or delivery, not entered on the website.</p>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {cartItems.length > 0 && checkoutStep === 'cart' && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span className={styles.totalAmount}>${cartTotal}</span>
                </div>
                <button className={styles.checkoutBtn} onClick={handleCheckoutInit}>
                  Continue to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
