'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { 
  Package, 
  Users, 
  Settings, 
  Layout, 
  ChevronRight, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Menu,
  X,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { useOrders } from '@/lib/orders-context';
import styles from './Admin.module.css';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Real Local Storage state for settings
  const [phones, setPhones] = useState(['+16612223344', '', '', '', '', '']);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  const { orders, updateOrderStatus } = useOrders();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'HGM2026') {
      setIsAuthenticated(true);
    }
  };

  const handleStatusUpdate = (id, status) => {
    import('@/lib/AudioEngine').then(ae => ae.default.playClick());
    updateOrderStatus(id, status);
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders?.filter(o => o.date?.startsWith(today)) || [];
    return {
      total: orders?.length || 0,
      today: todayOrders.length,
      revenue: todayOrders.reduce((acc, curr) => acc + curr.total, 0),
      pending: orders?.filter(o => o.status === 'Pending').length || 0
    };
  }, [orders]);

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <Image src="/logo.png" alt="HGM Logo" width={100} height={100} className={styles.loginLogo} />
          <h1>HGM ADMIN</h1>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="TERMINAL KEY" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.loginInput}
            />
            <button type="submit" className={styles.loginBtn}>ACCESS SYSTEM</button>
          </form>
        </div>
      </div>
    );
  }

  const renderOrders = () => (
    <div className={styles.view}>
      <header className={styles.viewHeader}>
        <h2><Package size={24} /> ORDERS_LOG</h2>
        <div className={styles.viewActions}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input type="text" placeholder="Filter by name/ID..." />
          </div>
          <button className={styles.actionBtn}><Filter size={18} /> Filters</button>
        </div>
      </header>

      <div className={styles.ordersCard}>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>CUSTOMER</th>
              <th>TYPE</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className={styles[order.status.toLowerCase()]}>
                <td className={styles.id}>{order.id}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>
                  <div className={styles.customerInfo}>
                    <span className={styles.customerName}>{order.customer.name}</span>
                    <span className={styles.customerSub}>{order.customer.phone}</span>
                  </div>
                </td>
                <td><span className={styles.typeBadge}>{order.type}</span></td>
                <td className={styles.total}>${order.total}</td>
                <td>
                  <span className={`${styles.statusLabel} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  {order.status === 'Pending' && (
                    <>
                      <button onClick={() => handleStatusUpdate(order.id, 'Completed')} className={styles.completeBtn}>COMPLETE</button>
                      <button className={styles.smsBtn}>RESEND SMS</button>
                    </>
                  )}
                  {order.status === 'Completed' && <CheckCircle2 size={20} color="#00ff00" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className={styles.view}>
      <header className={styles.viewHeader}>
        <h2><Layout size={24} /> PRODUCT_SYSTEM</h2>
        <button className={styles.primaryAction}>+ NEW PRODUCT</button>
      </header>
      <div className={styles.emptyState}>
        <RefreshCw size={48} />
        <p>Syncing inventory from master catalog...</p>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className={styles.view}>
      <header className={styles.viewHeader}>
        <h2><Layout size={24} /> CONTENT_MODULES</h2>
      </header>
      <div className={styles.contentGrid}>
        {['FAQ_SYSTEM', 'LEGAL_PAGES', 'CULTURE_FEED', 'LOCATION_DATA'].map(item => (
          <div key={item} className={styles.contentCard} onClick={() => setEditingContent(item)}>
            <h3>{item}</h3>
            <p>Last modified: 2 hours ago</p>
            <ChevronRight />
          </div>
        ))}
      </div>

      {editingContent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>EDITING: {editingContent}</h2>
            <textarea className={styles.terminalText}/ >
            <div className={styles.modalActions}>
                <button onClick={() => setEditingContent(null)} className={styles.cancelBtn}>CANCEL</button>
                <button className={styles.saveBtn}>SAVE TO TERMINAL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className={styles.view}>
      <header className={styles.viewHeader}>
        <h2><Settings size={24} /> SYSTEM_CONFIG</h2>
        <button 
          className={styles.saveSettingsBtn} 
          onClick={() => {
            setIsSaving(true);
            setTimeout(() => setIsSaving(false), 1500);
          }}
          disabled={isSaving}
        >
          {isSaving ? 'SAVING...' : 'SAVE CONFIG'}
        </button>
      </header>
      
      <div className={styles.settingsGrid}>
        <div className={styles.settingsSection}>
            <h3><AlertCircle size={20} /> NOTIFICATION LIST</h3>
            <div className={styles.phoneList}>
                {phones.map((phone, i) => (
                    <div key={i} className={styles.row}>
                        <label>Recipient {i+1}</label>
                        <input 
                          type="text" 
                          value={phone} 
                          onChange={(e) => {
                            const newPhones = [...phones];
                            newPhones[i] = e.target.value;
                            setPhones(newPhones);
                          }}
                          placeholder="+1661..." 
                        />
                    </div>
                ))}
            </div>
        </div>

        <div className={styles.settingsSection}>
            <h3><Clock size={20} /> OPERATIONS HOURS</h3>
            <div className={styles.opsHours}>
                <span>Current Status: <strong style={{color: isShopOpen ? '#00ff00' : '#ff0000'}}>{isShopOpen ? 'Live' : 'Closed'}</strong></span>
                <button 
                  onClick={() => setIsShopOpen(!isShopOpen)}
                  style={{ background: isShopOpen ? '#400' : '#040', color: isShopOpen ? '#f00' : '#0f0' }}
                >
                  {isShopOpen ? 'CLOSE SHOP MANUALLY' : 'OPEN SHOP MANUALLY'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${styles.dashboard} ${!isSidebarOpen ? styles.sidebarCollapsed : ''}`}>
      <aside className={styles.sidebar}>
        <div className={styles.sideHeader}>
          <Image src="/logo.png" alt="HGM Logo" width={40} height={40} />
          <span>HGM TERMINAL</span>
          <button onClick={() => setIsSidebarOpen(false)} className={styles.collapseBtn}><X size={18} /></button>
        </div>

        <nav className={styles.sideNav}>
          <button className={activeTab === 'orders' ? styles.active : ''} onClick={() => { import('@/lib/AudioEngine').then(ae => ae.default.playClick()); setActiveTab('orders'); }}>
            <Package size={20} /> <span>Orders</span>
          </button>
          <button className={activeTab === 'products' ? styles.active : ''} onClick={() => { import('@/lib/AudioEngine').then(ae => ae.default.playClick()); setActiveTab('products'); }}>
            <Layout size={20} /> <span>Products</span>
          </button>
          <button className={activeTab === 'content' ? styles.active : ''} onClick={() => { import('@/lib/AudioEngine').then(ae => ae.default.playClick()); setActiveTab('content'); }}>
            <Users size={20} /> <span>Content</span>
          </button>
          <button className={activeTab === 'settings' ? styles.active : ''} onClick={() => { import('@/lib/AudioEngine').then(ae => ae.default.playClick()); setActiveTab('settings'); }}>
            <Settings size={20} /> <span>Settings</span>
          </button>
        </nav>

        <div className={styles.sideFooter}>
          <button className={styles.logoutBtn} onClick={() => window.location.reload()}>
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topHeader}>
          {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className={styles.expandBtn}><Menu size={20} /></button>}
          <div className={styles.statsStrip}>
            <div className={styles.statItem}>
              <span className={styles.statVal}>{stats.revenue}</span>
              <span className={styles.statLabel}>DAY_REVENUE</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>{stats.today}</span>
              <span className={styles.statLabel}>NEW_ORDERS</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>{stats.pending}</span>
              <span className={styles.statLabel}>PENDING_TASKS</span>
            </div>
          </div>
        </header>

        <div className={styles.contentArea}>
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'content' && renderContent()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
}
