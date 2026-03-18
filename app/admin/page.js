'use client';

import { useState, useMemo } from 'react';
import { useOrders } from '@/lib/orders-context';
import { PRODUCTS } from '@/lib/products';
import styles from './Admin.module.css';
import { Package, Truck, CheckCircle, Clock, DollarSign, ArrowLeft, Layout, ShoppingBag, Settings, Menu, X, Plus, AlertCircle, Phone, MessageSquare, HelpCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
  const ordersContext = useOrders();
  const orders = ordersContext?.orders || [];
  const updateOrderStatus = ordersContext?.updateOrderStatus || (() => {});
  
  const [activeView, setActiveView] = useState('Orders');
  const [activeOrderTab, setActiveOrderTab] = useState('Pending');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          <Image src="/logo.png" alt="HGM Logo" width={100} height={100} className={styles.loginLogo} />
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

  const renderOrders = () => {
    const filteredOrders = orders.filter(o => {
      if (activeOrderTab === 'Pending') return o.status === 'Pending';
      if (activeOrderTab === 'Completed') return o.status === 'Completed';
      return true;
    });

    return (
      <div className={styles.viewContent}>
        <div className={styles.viewHeader}>
          <h2>ORDER TRACKING</h2>
          <div className={styles.orderTabs}>
            <button 
              className={`${styles.viewTab} ${activeOrderTab === 'Pending' ? styles.activeViewTab : ''}`}
              onClick={() => setActiveOrderTab('Pending')}
            >
              ACTIVE ({stats.pending})
            </button>
            <button 
              className={`${styles.viewTab} ${activeOrderTab === 'Completed' ? styles.activeViewTab : ''}`}
              onClick={() => setActiveOrderTab('Completed')}
            >
              ARCHIVE
            </button>
          </div>
        </div>

        <div className={styles.orderList}>
          {filteredOrders.length === 0 ? (
            <p className={styles.empty}>NO ORDERS FOUND IN THIS CATEGORY.</p>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHead}>
                  <span className={styles.orderId}>#{order.id.slice(-6).toUpperCase()}</span>
                  <span className={`${styles.orderTag} ${order.type === 'Delivery' ? styles.tagDelivery : styles.tagPickup}`}>
                    {order.type.toUpperCase()}
                  </span>
                  <span className={styles.orderTime}>{new Date(order.date).toLocaleString()}</span>
                </div>
                
                <div className={styles.orderBodyMini}>
                  <div className={styles.clientInfo}>
                    <h3>{order.customer.name}</h3>
                    <p>{order.customer.phone}</p>
                    {order.type === 'Delivery' && <p className={styles.addressLine}>{order.customer.address}</p>}
                  </div>
                  
                  <div className={styles.itemsList}>
                    {order.items.map((item, i) => (
                      <div key={i} className={styles.itemRow}>
                        <span>{item.quantity}x {item.name}</span>
                        <span>{item.selectedSize ? `[${item.selectedSize}]` : ''}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.actionsBox}>
                    <span className={styles.amount}>${order.total}</span>
                    {order.status === 'Pending' && (
                      <div className={styles.btnGroup}>
                         <button 
                          className={styles.completeBtn}
                          onClick={() => updateOrderStatus(order.id, 'Completed')}
                        >
                          <CheckCircle size={16} /> COMPLETE
                        </button>
                        <button className={styles.alertBtn}>
                           <MessageSquare size={16} /> RESEND SMS
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderProducts = () => {
    return (
      <div className={styles.viewContent}>
        <div className={styles.viewHeader}>
          <h2>INVENTORY MANAGEMENT</h2>
          <button className={styles.addBtn}><Plus size={18} /> NEW SKU</button>
        </div>
        <div className={styles.productList}>
          {PRODUCTS.map(product => (
            <div key={product.id} className={styles.productRow}>
              <div className={styles.prodImg}><Image src={product.image} alt={product.name} width={50} height={50} style={{objectFit: 'cover'}} /></div>
              <div className={styles.prodInfo}>
                <span className={styles.prodName}>{product.name}</span>
                <span className={styles.prodSlug}>{product.slug}</span>
              </div>
              <span className={styles.prodCat}>{product.category}</span>
              <span className={styles.prodPrice}>${product.price}</span>
              <div className={styles.prodActions}>
                <button className={styles.editBtn}>EDIT</button>
                <button className={styles.hideBtn}>HIDE</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={styles.viewContent}>
        <div className={styles.viewHeader}>
          <h2>CONTENT MODULES</h2>
        </div>
        <div className={styles.contentGrid}>
           <div className={styles.contentTile}>
              <HelpCircle size={32} />
              <h3>FAQ / Support</h3>
              <p>Manage common customer questions.</p>
              <button>Edit Section</button>
           </div>
           <div className={styles.contentTile}>
              <Truck size={32} />
              <h3>Shipping & Returns</h3>
              <p>Update logistics guidelines.</p>
              <button>Edit Terms</button>
           </div>
           <div className={styles.contentTile}>
              <FileText size={32} />
              <h3>Legal / Compliance</h3>
              <p>21+ notices and disclaimers.</p>
              <button>Edit Legal</button>
           </div>
           <div className={styles.contentTile}>
              <Layout size={32} />
              <h3>Culture Feed</h3>
              <p>Curate IG/TikTok visuals.</p>
              <button>Edit Feed</button>
           </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className={styles.viewContent}>
        <div className={styles.viewHeader}>
            <h2>TERMINAL SETTINGS</h2>
        </div>
        <div className={styles.settingsSection}>
           <h3><AlertCircle size={20} /> ALERT RECIPIENTS (5–6 PHONES)</h3>
           <p>SMS notifications will be sent to these numbers for every new order.</p>
           <div className={styles.phoneGrid}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className={styles.phoneInputRow}>
                   <Phone size={16} />
                   <input type="text" placeholder={`Phone ${i} (+1...)`} defaultValue={i === 1 ? '+16612223344' : ''} />
                </div>
              ))}
           </div>
           <button className={styles.saveBtn}>UPDATE NOTIFICATION LIST</button>
        </div>
        <div className={styles.settingsSection}>
            <h3><Clock size={20} /> OPERATIONS HOURS</h3>
            <div className={styles.opsHours}>
                <span>Current Status: <strong style={{color: '#00ff00'}}>Live</strong></span>
                <button>CLOSE SHOP MANUALLY</button>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.dashboard} ${!isSidebarOpen ? styles.sidebarCollapsed : ''}`}>
      <aside className={styles.sidebar}>
        <div className={styles.sideHeader}>
          <Image src="/logo.png" alt="HGM Logo" width={40} height={40} />
          <span className="brand-font">HGM TERMINAL</span>
          <button onClick={() => setIsSidebarOpen(false)} className={styles.collapseBtn}><X size={18} /></button>
        </div>
        
        <nav className={styles.sideNav}>
          <button className={activeView === 'Orders' ? styles.activeSide : ''} onClick={() => setActiveView('Orders')}>
            <Package size={20} /> <span>ORDERS</span>
          </button>
          <button className={activeView === 'Products' ? styles.activeSide : ''} onClick={() => setActiveView('Products')}>
            <ShoppingBag size={20} /> <span>PRODUCTS</span>
          </button>
          <button className={activeView === 'Content' ? styles.activeSide : ''} onClick={() => setActiveView('Content')}>
            <Layout size={20} /> <span>CONTENT</span>
          </button>
          <button className={activeView === 'Settings' ? styles.activeSide : ''} onClick={() => setActiveView('Settings')}>
            <Settings size={20} /> <span>SETTINGS</span>
          </button>
        </nav>
        
        <div className={styles.sideFooter}>
          <p>LOGGED IN AS ADMIN</p>
          <Link href="/" className={styles.exitLink}><ArrowLeft size={14} /> EXIT TERMINAL</Link>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          {!isSidebarOpen && (
            <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
          )}
          <div className={styles.viewTitle}>
            <h1>{activeView.toUpperCase()}</h1>
          </div>
          <div className={styles.quickStats}>
            <div className={styles.qStat}><span>${stats.dailyTotal}</span> TODAY</div>
            <div className={styles.qStat}><span>{stats.pending}</span> PENDING</div>
          </div>
        </header>

        {activeView === 'Orders' && renderOrders()}
        {activeView === 'Products' && renderProducts()}
        {activeView === 'Content' && renderContent()}
        {activeView === 'Settings' && renderSettings()}
      </main>
    </div>
  );
}
