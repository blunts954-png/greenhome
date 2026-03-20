'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CreditCard, RefreshCw } from 'lucide-react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { getStripePublishableKey, isStripePublicConfigured } from '@/lib/stripe-public';
import styles from './CartDrawer.module.css';

let cachedStripePromise = null;

function getStripePromise() {
  if (!cachedStripePromise && isStripePublicConfigured()) {
    cachedStripePromise = loadStripe(getStripePublishableKey());
  }

  return cachedStripePromise;
}

const cardElementOptions = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: 'inherit',
      fontSize: '16px',
      '::placeholder': {
        color: '#7f7f7f'
      }
    },
    invalid: {
      color: '#ffb7b7'
    }
  },
  hidePostalCode: true
};

function StripeCheckoutForm({
  amount,
  order,
  customer,
  isProcessing,
  onConfirmed
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function createPaymentIntent() {
      try {
        setError('');
        setStatus('loading');

        const response = await fetch('/api/stripe/payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(order)
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || 'Unable to start Stripe checkout.');
        }

        if (!cancelled) {
          setClientSecret(payload.clientSecret || '');
          setStatus('ready');
        }
      } catch (stripeError) {
        console.error('Stripe payment intent failed:', stripeError);
        if (!cancelled) {
          setError(stripeError.message || 'Stripe could not initialize.');
          setStatus('error');
        }
      }
    }

    createPaymentIntent();

    return () => {
      cancelled = true;
    };
  }, [order]);

  const handleConfirm = async () => {
    if (!stripe || !elements || !clientSecret) {
      setError('Stripe card fields are not ready yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Stripe card fields are not ready yet.');
      return;
    }

    setError('');
    setStatus('confirming');

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${customer.firstName} ${customer.lastName}`.trim(),
            email: customer.email,
            phone: customer.phone
          }
        }
      });

      if (result.error) {
        setError(result.error.message || 'Stripe could not confirm the card payment.');
        setStatus('ready');
        return;
      }

      const paymentIntent = result.paymentIntent;

      if (!paymentIntent || !['succeeded', 'processing', 'requires_capture'].includes(paymentIntent.status)) {
        setError('Stripe did not complete the card payment.');
        setStatus('ready');
        return;
      }

      await onConfirmed({
        provider: 'stripe',
        paymentIntentId: paymentIntent.id,
        paymentMethodId:
          typeof paymentIntent.payment_method === 'string'
            ? paymentIntent.payment_method
            : paymentIntent.payment_method?.id || ''
      });
      setStatus('ready');
    } catch (stripeError) {
      console.error('Stripe confirmation failed:', stripeError);
      setError(stripeError.message || 'Stripe could not confirm the payment.');
      setStatus('ready');
    }
  };

  return (
    <div className={styles.stripeWrapper}>
      <div className={styles.stripeHeader}>
        <CreditCard size={18} />
        <span>Stripe Card Checkout</span>
      </div>

      <div className={styles.stripeMount}>
        <CardElement options={cardElementOptions} />
      </div>

      {error && (
        <div className={styles.stripeError}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.demoNotice}>
        Stripe is set up for shipping card orders. Once your publishable key, secret key, and webhook secret are added, this card form will confirm the payment and then submit the order to your backend.
      </div>

      <button
        type="button"
        className={styles.finalSubmitBtn}
        disabled={isProcessing || status === 'loading' || status === 'confirming' || status === 'error' || !stripe}
        onClick={handleConfirm}
      >
        {isProcessing || status === 'confirming'
          ? 'Processing Stripe...'
          : `Pay with Stripe • $${amount}`}
      </button>

      {status === 'loading' && (
        <div className={styles.stripeState}>
          <RefreshCw size={16} />
          <p>Preparing secure Stripe card fields...</p>
        </div>
      )}
    </div>
  );
}

export default function StripeCardStep(props) {
  const stripePromise = useMemo(() => getStripePromise(), []);

  if (!isStripePublicConfigured()) {
    return (
      <div className={styles.stripeState}>
        <AlertCircle size={18} />
        <p>Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to enable the live Stripe card form.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm {...props} />
    </Elements>
  );
}
