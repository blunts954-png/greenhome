'use client';

import { useState } from 'react';
import { Search, Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import styles from './page.module.css';

const STATUS_ICONS = {
  Completed: <CheckCircle size={20} />,
  Pending: <Clock size={20} />,
  Cancelled: <XCircle size={20} />,
  'Missed Pickup': <XCircle size={20} />,
  'No Show': <XCircle size={20} />,
};

export default function OrderLookupPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else {
        setResult(data.order);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Package size={32} className={styles.icon} />
          <h1 className="brand-font">Order Lookup</h1>
          <p>Enter your order number and the email you used at checkout to check your order status.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            <span>Order Number</span>
            <input
              type="text"
              required
              placeholder="e.g. ORD-12345678-123"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              autoComplete="off"
              aria-label="Order number"
            />
          </label>

          <label className={styles.field}>
            <span>Email Address</span>
            <input
              type="email"
              required
              placeholder="Email used at checkout"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-label="Email address"
            />
          </label>

          {error && (
            <p className={styles.error} role="alert">{error}</p>
          )}

          <button type="submit" className={styles.btn} disabled={loading}>
            <Search size={16} />
            {loading ? 'Looking up...' : 'Find Order'}
          </button>
        </form>

        {result && (
          <div className={styles.result} role="region" aria-label="Order details">
            <div className={styles.resultHeader}>
              <h2 className="brand-font">{result.orderNumber}</h2>
              <span className={`${styles.statusBadge} ${styles[`status${result.status.replace(/\s+/g, '')}`] || styles.statusDefault}`}>
                {STATUS_ICONS[result.status] || <Package size={20} />}
                {result.status}
              </span>
            </div>

            <div className={styles.meta}>
              <div className={styles.metaRow}>
                <span>Placed</span>
                <strong>{new Date(result.date).toLocaleString()}</strong>
              </div>
              <div className={styles.metaRow}>
                <span>Fulfillment</span>
                <strong>{result.type}</strong>
              </div>
              <div className={styles.metaRow}>
                <span>Payment</span>
                <strong>{result.payment}</strong>
              </div>
              <div className={styles.metaRow}>
                <span>Total</span>
                <strong>${result.total.toFixed(2)}</strong>
              </div>
              {result.pickupDeadline && result.status === 'Pending' && (
                <div className={styles.metaRow}>
                  <span>Pickup By</span>
                  <strong>{new Date(result.pickupDeadline).toLocaleString()}</strong>
                </div>
              )}
            </div>

            {result.items.length > 0 && (
              <div className={styles.items}>
                <h3>Items</h3>
                {result.items.map((item, i) => (
                  <div key={i} className={styles.item}>
                    <span>{item.name}{item.size ? ` (${item.size})` : ''}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            <p className={styles.helpText}>
              Questions about your order? <a href="/contact">Contact us</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
