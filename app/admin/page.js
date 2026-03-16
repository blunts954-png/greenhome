'use client';

import { useState, useMemo } from 'react';
import { useOrders } from '@/lib/orders-context';
import styles from './Admin.module.css';
import { Package, Truck, CheckCircle, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { orders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState('Pending');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.date.startsWith(today));
    const total = todayOrders.reduce((sum, o) => sum + o.total, 0);
    
    return {
      pending: orders.filter(o => o.status === 'Pending').length,
      deliveries: orders.filter(o => o.status === 'Pending' && o.type === 'Delivery').length,
      pickups: orders.filter(o => o.status === 'Pending' && o.type === 'Pickup').length,
      dailyTotal: total
    };
  }, [orders]);

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'Pending') return o.status === 'Pending';
    if (activeTab === 'Completed') return o.status === 'Completed';
    return true;
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'HGM2026') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid Credentials');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className="brand-font">HGM ADMIN</h1>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="ENTER SECURE KEY" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.loginInput}
            />
            <button type="submit" className={styles.loginBtn}>ENTER TERMINAL</button>
          </form>
          <Link href="/" className={styles.backLink}><ArrowLeft size={16} /> Return to Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashHeader}>
        <h1 className="brand-font">MANAGEMENT TERMINAL</h1>
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <Clock size={20} className={styles.iconPending} />
            <div>
              <span className={styles.statVal}>{stats.pending}</span>
              <span className={styles.statLabel}>PENDING</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <Truck size={20} className={styles.iconDelivery} />
            <div>
              <span className={styles.statVal}>{stats.deliveries}</span>
              <span className={styles.statLabel}>DELIVERIES</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <Package size={20} className={styles.iconPickup} />
            <div>
              <span className={styles.statVal}>{stats.pickups}</span>
              <span className={styles.statLabel}>PICKUPS</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <DollarSign size={20} className={styles.iconDaily} />
            <div>
              <span className={styles.statVal}>${stats.dailyTotal}</span>
              <span className={styles.statLabel}>DAILY TOTAL</span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.dashMain}>
        <div className={styles.tabBar}>
          <button 
            className={`${styles.tab} ${activeTab === 'Pending' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('Pending')}
          >
            ACTIVE ORDERS
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'Completed' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('Completed')}
          >
            PAST ORDERS
          </button>
        </div>

        <div className={styles.orderList}>
          {filteredOrders.length === 0 ? (
            <p className={styles.empty}>NO ORDERS FOUND IN THIS CATEGORY.</p>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHead}>
                  <span className={styles.orderId}>{order.id}</span>
                  <span className={`${styles.orderTag} ${order.type === 'Delivery' ? styles.tagDelivery : styles.tagPickup}`}>
                    {order.type.toUpperCase()}
                  </span>
                  <span className={styles.orderDate}>{new Date(order.date).toLocaleTimeString()}</span>
                </div>
                
                <div className={styles.orderBody}>
                  <div className={styles.customerInfo}>
                    <h3>{order.customer.name}</h3>
                    <p>{order.customer.phone}</p>
                    {order.type === 'Delivery' && <p className={styles.address}>{order.customer.address}</p>}
                  </div>
                  
                  <div className={styles.orderItems}>
                    <ul>
                      {order.items.map((item, i) => (
                        <li key={i}>{item.quantity}x {item.name}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={styles.orderFooter}>
                    <span className={styles.totalPrice}>TOTAL: ${order.total}</span>
                    {order.status === 'Pending' && (
                      <button 
                        className={styles.completeBtn}
                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                      >
                        <CheckCircle size={18} /> COMPLETE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
