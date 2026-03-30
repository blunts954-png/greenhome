'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useOrders } from '@/lib/orders-context';
import { X, Trash2, ShoppingBag, CheckCircle, Truck, Package, CreditCard, ChevronRight, Mail, Phone, MapPin, MessageSquare, UserRound } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { isStripePublicConfigured } from '@/lib/stripe-public';
import StripeCardStep from './StripeCardStep';
import styles from './CartDrawer.module.css';

const CHECKOUT_DEMO_MODE = process.env.NEXT_PUBLIC_CHECKOUT_DEMO_MODE === 'true';

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  birthDate: '',
  address: '',
  notes: '',
  payment: 'Card'
};

const INITIAL_CARD_FORM = {
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: ''
};

const springPhysics = {
  type: 'spring',
  mass: 1.2,
  stiffness: 250,
  damping: 30
};

function getPaymentLabel(payment, orderType) {
  if (payment !== 'Card') {
    return payment;
  }

  return orderType === 'Shipping' ? 'Stripe card before shipment' : 'Card at pickup';
}

function formatPaymentText(value = '') {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export default function CartDrawer() {
  const cartContext = useCart();
  const { cartItems = [], cartTotal = 0, isDrawerOpen = false, toggleDrawer = () => {}, removeFromCart = () => {}, clearCart = () => {} } = cartContext || {};

  const ordersContext = useOrders();
  const { addOrder = async () => null, isAccountBlocked = async () => null } = ordersContext || {};

  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [orderType, setOrderType] = useState('Shipping');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [cardForm, setCardForm] = useState(INITIAL_CARD_FORM);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const stripeReady = isStripePublicConfigured();

  const hasLocalOnlyItems = useMemo(
    () => cartItems.some((item) => item.storeSection === 'cannabis' || item.pickupOnly),
    [cartItems]
  );

  const fulfillmentOptions = useMemo(
    () => {
      // Apparel only orders can ship US-wide
      if (!hasLocalOnlyItems) return ['Shipping', 'Pickup', 'Delivery'];
      // Cannabis or mixed orders stay local
      return ['Pickup', 'Delivery'];
    },
    [hasLocalOnlyItems]
  );

  const paymentOptions = useMemo(
    () => {
      if (orderType === 'Shipping') return ['Card'];
      // Both Apparel and Cannabis can now use Card or Cash locals
      return ['Card', 'Cash'];
    },
    [orderType]
  );

  const needsHostedCardStep = formData.payment === 'Card';
  const stripeUnavailable = !CHECKOUT_DEMO_MODE && needsHostedCardStep && !stripeReady;

  const checkoutPayload = useMemo(
    () => ({
      customer: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        birthDate: formData.birthDate || '',
        address: orderType === 'Pickup' ? '' : formData.address.trim(),
        notes: formData.notes.trim()
      },
      items: cartItems.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize || null
      })),
      total: cartTotal,
      type: orderType,
      payment: formData.payment
    }),
    [cartItems, cartTotal, formData, orderType]
  );

  useEffect(() => {
    if (!fulfillmentOptions.includes(orderType)) {
      setOrderType(fulfillmentOptions[0] || 'Pickup');
    }
  }, [fulfillmentOptions, orderType]);

  useEffect(() => {
    if (!paymentOptions.includes(formData.payment)) {
      setFormData((prev) => ({
        ...prev,
        payment: paymentOptions[0] || 'Card'
      }));
    }
  }, [formData.payment, paymentOptions]);

  useEffect(() => {
    if (!isDrawerOpen) {
      setTimeout(() => {
        setCheckoutStep('cart');
        setSubmittedOrder(null);
        setCardForm(INITIAL_CARD_FORM);
      }, 300);
    }
  }, [isDrawerOpen]);

  const handleClose = () => {
    toggleDrawer();
  };

  const handleRemove = (id, size) => {
    removeFromCart(id, size);
  };

  const handleCheckoutInit = () => {
    setOrderError('');
    setSubmittedOrder(null);
    setCheckoutStep('contact');
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    const blockedAccount = await isAccountBlocked(formData.email, formData.phone);
    if (blockedAccount) {
      setOrderError(blockedAccount.banReason || 'This account is currently blocked.');
      return;
    }

    setOrderError('');
    setCheckoutStep('fulfillment');
  };

  const handleFulfillmentSubmit = (event) => {
    event.preventDefault();

    if (orderType === 'Shipping' && !formData.address.trim()) {
      return;
    }

    setCheckoutStep('review');
  };

  const handleFinalSubmit = async (paymentRequest = null) => {
    setIsProcessing(true);
    setOrderError('');

    const orderData = {
      ...checkoutPayload
    };

    if (paymentRequest) {
      orderData.paymentRequest = paymentRequest;
    }

    const newOrder = await addOrder(orderData);

    if (newOrder?.error) {
      setIsProcessing(false);
      setOrderError(newOrder.error);
      if (newOrder.code === 'ACCOUNT_BANNED') {
        setCheckoutStep('contact');
      }
      return;
    }

    if (newOrder && !newOrder.demo) {
      try {
        await fetch('/api/order-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: newOrder.id,
            customerName: newOrder.customer.name,
            customerEmail: newOrder.customer.email,
            customerPhone: newOrder.customer.phone,
            customerAddress: newOrder.customer.address,
            total: newOrder.total,
            type: newOrder.type,
            payment: getPaymentLabel(newOrder.payment, newOrder.type),
            items: newOrder.items
          })
        });
      } catch (error) {
        console.error('Order alert request failed:', error);
      }
    }

    setSubmittedOrder(newOrder);
    setIsProcessing(false);
    setCheckoutStep('success');

    setTimeout(() => {
      clearCart();
      setFormData(INITIAL_FORM);
      setCardForm(INITIAL_CARD_FORM);
      setOrderType('Shipping');
    }, 500);
  };

  const handleReviewContinue = () => {
    if (needsHostedCardStep) {
      setCheckoutStep('payment');
      return;
    }

    handleFinalSubmit();
  };

  const handleDemoPaymentSubmit = async (event) => {
    event.preventDefault();
    await handleFinalSubmit();
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
              <span className={checkoutStep === 'payment' ? styles.activeStep : ''}>Payment</span>
            </div>

            <div className={styles.itemsContainer}>
              {checkoutStep === 'success' ? (
                <motion.div className={styles.successState} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className={styles.successLogo}>
                    <Image src="/logo-mark.png" alt="HGM" width={36} height={56} />
                  </div>
                  <CheckCircle size={60} className={styles.successIcon} />
                  <h3>
                    {submittedOrder?.demo
                      ? 'Demo Checkout Complete'
                      : submittedOrder?.paymentProvider === 'stripe'
                        ? 'Payment Approved'
                        : 'Order Reserved'}
                  </h3>
                  <p>
                    {submittedOrder?.demo
                      ? 'This demo reached the payment finish point successfully. No real order was stored and no card was charged.'
                      : submittedOrder?.paymentProvider === 'stripe'
                        ? 'Stripe approved the shipping payment and the order record was saved successfully.'
                        : 'Your order details were captured successfully. We will follow up using the contact information you provided.'}
                  </p>
                  <div className={styles.orderSummaryBox}>
                    <p>Order ID: <strong>{submittedOrder?.id || 'Demo'}</strong></p>
                    <p>Total: <strong>${submittedOrder?.total ?? cartTotal}</strong></p>
                    <p>Fulfillment: <strong>{submittedOrder?.type || orderType}</strong></p>
                    <p>Payment: <strong>{getPaymentLabel(submittedOrder?.payment || formData.payment, submittedOrder?.type || orderType)}</strong></p>
                    {submittedOrder?.paymentProvider && <p>Processor: <strong>{formatPaymentText(submittedOrder.paymentProvider)}</strong></p>}
                    {submittedOrder?.paymentStatus && <p>Payment Status: <strong>{formatPaymentText(submittedOrder.paymentStatus)}</strong></p>}
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
                      {hasLocalOnlyItems && cartItems.some(i => i.storeSection === 'apparel') && (
                        <div className={styles.mixedCartNotice}>
                          🚨 This cart contains 21+ menu items. <strong>Local Bakersfield fulfillment only</strong> for the entire order. Shipping is disabled.
                        </div>
                      )}
                      {cartItems.map((item) => (
                        <div key={`${item.id}-${item.selectedSize || 'na'}`} className={styles.cartItem}>
                          <div className={styles.itemImg}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              style={{ objectFit: item.storeSection === 'apparel' ? 'contain' : 'cover' }}
                            />
                          </div>
                          <div className={styles.itemMeta}>
                            <h3>{item.name}</h3>
                            {item.selectedSize && <p className={styles.sizeInfo}>Size: {item.selectedSize}</p>}
                            <p className={styles.price}>${item.price} x {item.quantity}</p>
                            <p className={styles.fulfillmentTag}>{item.pickupOnly ? '21+ pickup only' : 'Shipping or pickup'}</p>
                          </div>
                          <button className={styles.removeBtn} onClick={() => handleRemove(item.id, item.selectedSize)} aria-label={`Remove ${item.name}`}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {checkoutStep === 'contact' && (
                    <motion.div className={styles.checkoutForm} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h3>Create Account</h3>
                      <p className={styles.stepDesc}>
                        {hasLocalOnlyItems
                          ? 'First name, last name, phone, email, and date of birth are required before a 21+ local reservation can continue.'
                          : 'First name, last name, phone, and email are required before checkout can continue.'}
                      </p>

                      <form onSubmit={handleContactSubmit} className={styles.formFields}>
                        <div className={styles.fieldRow}>
                          <label className={styles.fieldLabel}>
                            <span><UserRound size={14} /> First Name</span>
                            <input
                              type="text"
                              required
                              placeholder="First Name"
                              value={formData.firstName}
                              onChange={(event) => setFormData({ ...formData, firstName: event.target.value })}
                            />
                          </label>
                          <label className={styles.fieldLabel}>
                            <span><UserRound size={14} /> Last Name</span>
                            <input
                              type="text"
                              required
                              placeholder="Last Name"
                              value={formData.lastName}
                              onChange={(event) => setFormData({ ...formData, lastName: event.target.value })}
                            />
                          </label>
                        </div>
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
                        {hasLocalOnlyItems && (
                          <label className={styles.fieldLabel}>
                            <span>Date of Birth</span>
                            <input
                              type="date"
                              required
                              value={formData.birthDate}
                              onChange={(event) => setFormData({ ...formData, birthDate: event.target.value })}
                            />
                          </label>
                        )}
                        {orderError && <p className={styles.errorText}>{orderError}</p>}
                        <button type="submit" className={styles.nextBtn}>
                          Choose Fulfillment <ChevronRight size={18} />
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {checkoutStep === 'fulfillment' && (
                    <motion.div className={styles.checkoutForm} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h3>Fulfillment & Payment</h3>
                      <p className={styles.stepDesc}>
                        {hasLocalOnlyItems
                          ? 'Local 21+ orders support Pickup or Delivery. 9:30 PM deadline applies for all same-day fulfillment.'
                          : 'Choose shipping, Bakersfield pickup, or Bakersfield delivery.'}
                      </p>

                      <div className={styles.typeToggle}>
                        {fulfillmentOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`${styles.typeBtn} ${orderType === option ? styles.activeType : ''}`}
                            onClick={() => setOrderType(option)}
                          >
                            {option === 'Pickup' ? <Package size={18} /> : option === 'Delivery' ? <Truck size={18} /> : <Truck size={18} />}
                            {option}
                          </button>
                        ))}
                      </div>

                      <form onSubmit={handleFulfillmentSubmit} className={styles.formFields}>
                        {orderType === 'Shipping' ? (
                          <label className={styles.fieldLabel}>
                            <span><MapPin size={14} /> Shipping Address</span>
                            <textarea
                              required
                              placeholder="Enter shipping address"
                              value={formData.address}
                              onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                            />
                          </label>
                        ) : (
                          <div className={styles.pickupAlert}>
                            Local fulfillment is arranged in Bakersfield. 🚨 <strong>Pickups must be completed by 9:30 PM.</strong> No-shows for delivery or pickup result in an immediate permanent account/IP ban.
                          </div>
                        )}

                        <label className={styles.fieldLabel}>
                          <span><CreditCard size={14} /> Payment Method</span>
                          <div className={styles.paymentOptions}>
                            {paymentOptions.map((method) => (
                              <button
                                key={method}
                                type="button"
                                className={`${styles.payOption} ${formData.payment === method ? styles.activePay : ''}`}
                                onClick={() => setFormData({ ...formData, payment: method })}
                              >
                                {getPaymentLabel(method, orderType)}
                              </button>
                            ))}
                          </div>
                        </label>

                        <label className={styles.fieldLabel}>
                          <span><MessageSquare size={14} /> Notes</span>
                          <textarea
                            placeholder="Add pickup timing, apparel color requests, or any other order details"
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
                    <motion.div className={styles.reviewContainer} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h3>Review</h3>
                      <div className={styles.reviewCard}>
                        <p><span>Name</span><strong>{`${formData.firstName} ${formData.lastName}`.trim()}</strong></p>
                        <p><span>Phone</span><strong>{formData.phone}</strong></p>
                        <p><span>Email</span><strong>{formData.email}</strong></p>
                        <p><span>Fulfillment</span><strong>{orderType}</strong></p>
                        <p><span>Payment</span><strong>{getPaymentLabel(formData.payment, orderType)}</strong></p>
                        {hasLocalOnlyItems && <p><span>Date of Birth</span><strong>{formData.birthDate}</strong></p>}
                        {orderType === 'Shipping' && <p><span>Address</span><strong>{formData.address}</strong></p>}
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

                      <button className={styles.finalSubmitBtn} disabled={isProcessing || stripeUnavailable} onClick={handleReviewContinue}>
                        {stripeUnavailable
                          ? 'Stripe Setup Required'
                          : isProcessing
                          ? 'Submitting...'
                          : CHECKOUT_DEMO_MODE && needsHostedCardStep
                            ? `Continue to Card Demo • $${cartTotal}`
                            : needsHostedCardStep
                              ? `Continue to Secure Card • $${cartTotal}`
                              : `${CHECKOUT_DEMO_MODE ? 'Submit Demo Order' : 'Submit Order'} • $${cartTotal}`}
                      </button>
                      {!stripeReady && needsHostedCardStep && !CHECKOUT_DEMO_MODE && (
                        <p className={styles.errorText}>
                          Shipping card checkout is not live yet. Add the customer&apos;s Stripe keys to enable this step.
                        </p>
                      )}
                      {orderError && <p className={styles.errorText}>{orderError}</p>}
                      <p className={styles.submitNote}>
                        {CHECKOUT_DEMO_MODE && needsHostedCardStep
                          ? 'Demo checkout is active. The next step is a non-live card screen and no charge will be created.'
                          : needsHostedCardStep
                            ? 'Local and shipping card payments run through Stripe for immediate security.'
                            : orderType === 'Shipping'
                              ? 'Shipping orders require card payment before fulfillment.'
                              : 'Cash payments are collected locally in Bakersfield.'}
                      </p>
                    </motion.div>
                  )}

                  {checkoutStep === 'payment' && needsHostedCardStep && (
                    CHECKOUT_DEMO_MODE ? (
                      <motion.div className={styles.checkoutForm} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3>Card Demo</h3>
                        <p className={styles.stepDesc}>
                          This is a demo payment screen only. Card details are not sent anywhere and no charge will be created.
                        </p>

                        <form onSubmit={handleDemoPaymentSubmit} className={styles.formFields}>
                          <label className={styles.fieldLabel}>
                            <span><UserRound size={14} /> Cardholder Name</span>
                            <input
                              type="text"
                              required
                              placeholder="Name on Card"
                              value={cardForm.cardName}
                              onChange={(event) => setCardForm({ ...cardForm, cardName: event.target.value })}
                            />
                          </label>

                          <label className={styles.fieldLabel}>
                            <span><CreditCard size={14} /> Card Number</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              required
                              placeholder="4242 4242 4242 4242"
                              value={cardForm.cardNumber}
                              onChange={(event) => setCardForm({ ...cardForm, cardNumber: event.target.value })}
                            />
                          </label>

                          <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>
                              <span>Expiry</span>
                              <input
                                type="text"
                                required
                                placeholder="12/28"
                                value={cardForm.expiry}
                                onChange={(event) => setCardForm({ ...cardForm, expiry: event.target.value })}
                              />
                            </label>
                            <label className={styles.fieldLabel}>
                              <span>CVC</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                required
                                placeholder="123"
                                value={cardForm.cvc}
                                onChange={(event) => setCardForm({ ...cardForm, cvc: event.target.value })}
                              />
                            </label>
                          </div>

                          <div className={styles.demoNotice}>
                            Card demo only. Use test-style placeholder data and continue to the final success screen.
                          </div>

                          <button type="submit" className={styles.finalSubmitBtn} disabled={isProcessing}>
                            {isProcessing ? 'Finishing Demo...' : `Finish Demo Checkout • $${cartTotal}`}
                          </button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div className={styles.checkoutForm} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3>Secure Card Entry</h3>
                        <p className={styles.stepDesc}>
                          This step is ready for Stripe Elements. Shipping card orders confirm here and complete on the backend.
                        </p>

                        <StripeCardStep
                          amount={cartTotal}
                          order={checkoutPayload}
                          customer={checkoutPayload.customer}
                          isProcessing={isProcessing}
                          onConfirmed={handleFinalSubmit}
                        />
                        {orderError && <p className={styles.errorText}>{orderError}</p>}
                      </motion.div>
                    )
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
