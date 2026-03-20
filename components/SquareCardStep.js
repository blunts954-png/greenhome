'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CreditCard, RefreshCw } from 'lucide-react';

import {
  getSquareApplicationId,
  getSquareLocationId,
  getSquareScriptUrl,
  isSquarePublicConfigured
} from '@/lib/square-public';
import styles from './CartDrawer.module.css';

function loadSquareScript() {
  const existing = document.querySelector(`script[src="${getSquareScriptUrl()}"]`);

  if (existing) {
    if (window.Square) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = getSquareScriptUrl();
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load the Square Web Payments SDK.'));
    document.head.appendChild(script);
  });
}

function getTokenizeErrorMessage(result) {
  if (!result?.errors?.length) {
    return 'Square could not tokenize the card details.';
  }

  return result.errors.map((entry) => entry.message).join(' ');
}

export default function SquareCardStep({
  amount,
  isProcessing,
  onTokenized
}) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function initializeCard() {
      if (!isSquarePublicConfigured()) {
        setStatus('missing');
        return;
      }

      try {
        await loadSquareScript();

        if (!mounted || !containerRef.current || !window.Square) {
          return;
        }

        const payments = window.Square.payments(
          getSquareApplicationId(),
          getSquareLocationId()
        );
        const card = await payments.card();
        await card.attach(containerRef.current);

        cardRef.current = card;
        setStatus('ready');
      } catch (squareError) {
        console.error('Square initialization failed:', squareError);
        if (mounted) {
          setError(squareError.message || 'Square could not initialize.');
          setStatus('error');
        }
      }
    }

    initializeCard();

    return () => {
      mounted = false;
      if (cardRef.current?.destroy) {
        cardRef.current.destroy().catch(() => {});
      }
    };
  }, []);

  const handleTokenize = async () => {
    if (!cardRef.current) {
      setError('Square card fields are not ready yet.');
      return;
    }

    setError('');
    setStatus('tokenizing');

    try {
      const result = await cardRef.current.tokenize();

      if (result.status !== 'OK') {
        setError(getTokenizeErrorMessage(result));
        setStatus('ready');
        return;
      }

      await onTokenized({
        provider: 'square',
        sourceId: result.token
      });
      setStatus('ready');
    } catch (squareError) {
      console.error('Square tokenization failed:', squareError);
      setError(squareError.message || 'Square could not tokenize the payment.');
      setStatus('ready');
    }
  };

  if (status === 'missing') {
    return (
      <div className={styles.squareState}>
        <AlertCircle size={18} />
        <p>Add `NEXT_PUBLIC_SQUARE_APPLICATION_ID` and `NEXT_PUBLIC_SQUARE_LOCATION_ID` to enable the live Square card form.</p>
      </div>
    );
  }

  return (
    <div className={styles.squareWrapper}>
      <div className={styles.squareHeader}>
        <CreditCard size={18} />
        <span>Square Card Checkout</span>
      </div>

      <div className={styles.squareMount} ref={containerRef} />

      {error && (
        <div className={styles.squareError}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.demoNotice}>
        This step is wired for Square Web Payments SDK. Once your Square application ID, location ID, and access token are added, this button will tokenize the card and send it to the backend for payment processing.
      </div>

      <button
        type="button"
        className={styles.finalSubmitBtn}
        disabled={isProcessing || status === 'loading' || status === 'tokenizing' || status === 'error'}
        onClick={handleTokenize}
      >
        {isProcessing || status === 'tokenizing'
          ? 'Processing Square...'
          : `Pay with Square • $${amount}`}
      </button>

      {status === 'loading' && (
        <div className={styles.squareState}>
          <RefreshCw size={16} />
          <p>Loading secure Square card fields...</p>
        </div>
      )}
    </div>
  );
}
