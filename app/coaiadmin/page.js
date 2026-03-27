'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  RefreshCw,
  Settings,
  Users,
  Search,
  ShoppingCart,
  Eye,
  EyeOff
} from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import styles from './page.module.css';

const MOCK_DATA = {
  backendReady: true,
  orders: [],
  accounts: [],
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    todayOrders: 0,
    revenueToday: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    stripeRevenue: 0,
    bannedAccounts: 0,
    bannedIps: 0
  }
};

function formatCurrency(value = 0) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatPaymentText(value = '') {
  if (!value) return 'N/A';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminConfigured, setAdminConfigured] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryStatus, setInventoryStatus] = useState([]);
  const [loginError, setLoginError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [dashboard, setDashboard] = useState(MOCK_DATA);

  const loadInventory = useCallback(async () => {
    try {
      const response = await fetch('/api/coaiadmin/inventory');
      if (response.ok) {
        const data = await response.json();
        setInventoryStatus(data.status || []);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setActionError('');
    setActionNotice('');

    try {
      const response = await fetch('/api/coaiadmin/dashboard');
      const data = await response.json();

      if (response.ok) {
        setDashboard(data);
        await loadInventory();
      } else {
        setActionError(data.error || 'Failed to sync with Supabase.');
      }
    } catch (error) {
      console.error('Admin sync failed:', error);
      setActionError('The server is unreachable.');
    } finally {
      setIsLoading(false);
    }
  }, [loadInventory]);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const response = await fetch('/api/coaiadmin/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        const payload = await response.json();

        if (!mounted) {
          return;
        }

        setAdminConfigured(Boolean(payload.configured));

        if (payload.authenticated) {
          setIsAuthenticated(true);
          await loadDashboard();
        }
      } catch (error) {
        console.error('Admin session bootstrap failed:', error);
      } finally {
        if (mounted) {
          setAuthChecked(true);
        }
      }
    }

    bootstrap();
    return () => {
      mounted = false;
    };
  }, [loadDashboard]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coaiadmin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const payload = await response.json();

      if (!response.ok) {
        if (response.status === 503) {
          setAdminConfigured(false);
        }
        throw new Error(payload.error || 'Invalid admin key.');
      }

      setUsername('');
      setPassword('');
      setIsAuthenticated(true);
      await loadDashboard();
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    setIsLoading(true);
    setActionError('');
    setActionNotice('');

    try {
      const response = await fetch('/api/coaiadmin/dashboard', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_order', orderId, status })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update order.');
      }

      setActionNotice(`Order ${orderId} marked as ${status}.`);
      await loadDashboard();
    } catch (error) {
      setActionError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockToggle = async (slug, currentStatus) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/coaiadmin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, isOutOfStock: !currentStatus })
      });

      if (response.ok) {
        await loadInventory();
        setActionNotice(`Inventory updated for ${slug}.`);
      } else {
        const err = await response.json();
        setActionError(err.error || 'Failed to update inventory.');
      }
    } catch (err) {
      setActionError('Network error updating inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanToggle = async (account, banned) => {
    setIsLoading(true);
    setActionError('');
    setActionNotice('');

    try {
      const response = await fetch('/api/coaiadmin/dashboard', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_ban', customerName: account.name, customerEmail: account.email, banned, ip: account.lastIp })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update ban status.');
      }

      setActionNotice(`${account.name} is now ${banned ? 'Banned' : 'Restored'}.`);
      await loadDashboard();
    } catch (error) {
      setActionError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboard();
  };

  const filteredOrders = dashboard.orders.filter((order) => {
    const term = search.toLowerCase();
    return (
      order.id.toLowerCase().includes(term) ||
      order.customer?.name.toLowerCase().includes(term) ||
      order.customer?.email.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term) ||
      order.type.toLowerCase().includes(term)
    );
  });

  const filteredAccounts = dashboard.accounts.filter((account) => {
    const term = search.toLowerCase();
    return (
      account.name.toLowerCase().includes(term) ||
      account.email.toLowerCase().includes(term) ||
      account.phone.toLowerCase().includes(term) ||
      account.lastIp?.toLowerCase().includes(term)
    );
  });

  const filteredInventory = PRODUCTS.filter((product) => {
    const term = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.slug.toLowerCase().includes(term)
    );
  });

  if (!authChecked) {
    return (
      <div className={styles.loadingScreen}>
        <RefreshCw className={styles.spinner} size={48} />
        <p>INITIALIZING TERMINAL...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <Image src="/logo_v3.jpg" alt="HGM Logo" width={100} height={100} className={styles.loginLogo} />
          <h1>HGM ADMIN</h1>
          {adminConfigured ? (
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="ADMIN USER"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className={styles.loginInput}
              />
              <input
                type="password"
                placeholder="ADMIN PASSWORD"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={styles.loginInput}
              />
              <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                {isLoading ? 'ACCESSING...' : 'ACCESS SYSTEM'}
              </button>
            </form>
          ) : (
            <div className={styles.statusNotice}>
              <AlertCircle size={18} />
              <span>Set `ADMIN_DASHBOARD_USER` and `ADMIN_DASHBOARD_KEY` before using the admin area.</span>
            </div>
          )}
          {loginError && <p className={styles.loginError}>{loginError}</p>}
          <p className={styles.loginHelp}>Admin access is checked on the server and stored in an HTTP-only session cookie.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Image src="/logo-mark.png" alt="HGM" width={40} height={60} />
          <h2 className="brand-font">HGM HUB</h2>
        </div>

        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${activeTab === 'orders' ? styles.activeNav : ''}`} onClick={() => setActiveTab('orders')}>
            <Package size={20} />
            <span>Orders</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'inventory' ? styles.activeNav : ''}`} onClick={() => setActiveTab('inventory')}>
            <Archive size={20} />
            <span>Inventory</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'accounts' ? styles.activeNav : ''}`} onClick={() => setActiveTab('accounts')}>
            <Users size={20} />
            <span>CRM</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'settings' ? styles.activeNav : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} />
            <span>System</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={() => window.location.reload()}>
            <ArrowLeft size={16} />
            System Exit
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.topHeader}>
            <div className={styles.searchWrap}>
              <Search size={18} />
              <input
                type="text"
                placeholder={activeTab === 'orders' ? 'Search orders...' : activeTab === 'inventory' ? 'Search products...' : 'Search accounts...'}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.topHeaderActions}>
            <button className={styles.refreshBtn} onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={isLoading ? styles.spinner : ''} size={16} />
              {isLoading ? 'Syncing' : 'Refresh'}
            </button>
          </div>
        </header>

        <section className={styles.statsStrip}>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{formatCurrency(dashboard.stats.totalRevenue)}</span>
            <span className={styles.statLabel}>TOTAL SALES</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{formatCurrency(dashboard.stats.stripeRevenue)}</span>
            <span className={styles.statLabel}>STRIPE SALES</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{dashboard.stats.totalOrders}</span>
            <span className={styles.statLabel}>TOTAL ORDERS</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{dashboard.stats.pendingOrders}</span>
            <span className={styles.statLabel}>PENDING</span>
          </div>
        </section>

        <div className={styles.contentArea}>
          {actionError && (
            <div className={styles.errorBanner}>
              <AlertCircle size={18} />
              <span>{actionError}</span>
            </div>
          )}

          {actionNotice && (
            <div className={styles.successBanner}>
              <CheckCircle2 size={18} />
              <span>{actionNotice}</span>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className={styles.view}>
              <div className={styles.viewHeader}>
                <h2><Package size={24} /> Order Management</h2>
                <p>Manage pickup, delivery, and shipping requests.</p>
              </div>

              {filteredOrders.length === 0 ? (
                <div className={styles.emptyState}>
                  <Clock size={42} />
                  <p>No matching orders.</p>
                </div>
              ) : (
                <div className={styles.tableCard}>
                  <div className={styles.tableWrap}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Customer</th>
                          <th>Type</th>
                          <th>Payment</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <div className={styles.primaryCell}>{order.id}</div>
                              <div className={styles.secondaryCell}>{new Date(order.date).toLocaleString()}</div>
                            </td>
                            <td>
                              <div className={styles.primaryCell}>{order.customer?.name}</div>
                              <div className={styles.secondaryCell}>{order.customer?.phone}</div>
                            </td>
                            <td>{order.type}</td>
                            <td>
                              <div className={styles.primaryCell}>{formatPaymentText(order.payment)}</div>
                            </td>
                            <td>${Number(order.total).toFixed(2)}</td>
                            <td>
                              <span className={`${styles.pill} ${styles[`status${order.status.replace(/\s+/g, '')}`] || styles.statusDefault}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <div className={styles.rowActions}>
                                {order.status === 'Pending' && (
                                  <>
                                    <button className={styles.primaryBtn} onClick={() => handleOrderStatusUpdate(order.id, 'Completed')}>
                                      Done
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className={styles.view}>
              <div className={styles.viewHeader}>
                <h2><Archive size={24} /> Inventory Management</h2>
                <p>Toggle product visibility and stock status across the storefront.</p>
              </div>

              <div className={styles.inventoryGrid}>
                {filteredInventory.map((product) => {
                  const isOut = inventoryStatus.find(s => s.slug === product.slug)?.is_out_of_stock;
                  return (
                    <div key={product.slug} className={`${styles.inventoryCard} ${isOut ? styles.outOfStockCard : ''}`}>
                      <div className={styles.invMedia}>
                        <Image src={product.image} alt={product.name} width={60} height={60} style={{ objectFit: 'contain' }} />
                      </div>
                      <div className={styles.invInfo}>
                        <h4>{product.name}</h4>
                        <p>{product.category} &middot; {product.storeSection}</p>
                      </div>
                      <div className={styles.invAction}>
                        <button 
                          className={isOut ? styles.stockBtnOut : styles.stockBtnIn}
                          onClick={() => handleStockToggle(product.slug, !!isOut)}
                          disabled={isLoading}
                        >
                          {isOut ? <EyeOff size={16} /> : <Eye size={16} />}
                          {isOut ? 'OFFLINE' : 'LIVE'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className={styles.view}>
              <div className={styles.viewHeader}>
                <h2><Users size={24} /> CRM & Trust</h2>
                <p>Manage customer relationships and security controls.</p>
              </div>

              <div className={styles.accountGrid}>
                {filteredAccounts.map((account) => (
                  <article key={account.id} className={styles.accountCard}>
                    <div className={styles.accountHeader}>
                      <div>
                        <h3>{account.name}</h3>
                        <p>{account.email}</p>
                        <p>{account.phone}</p>
                      </div>
                      <span className={`${styles.pill} ${account.banned ? styles.statusMissedPickup : styles.statusCompleted}`}>
                        {account.banned ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                    <div className={styles.rowActions}>
                      {account.banned ? (
                        <button className={styles.primaryBtn} onClick={() => handleBanToggle(account, false)}>Restore</button>
                      ) : (
                        <button className={styles.secondaryBtn} onClick={() => handleBanToggle(account, true)}>Ban IP</button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles.view}>
              <div className={styles.viewHeader}>
                <h2><Settings size={24} /> Terminal Configuration</h2>
                <p>Critical environment variables and system health.</p>
              </div>
              <div className={styles.panelGrid}>
                <div className={styles.infoPanel}>
                  <h3>Active Infrastructure</h3>
                  <ul className={styles.infoList}>
                    <li>Supabase DB & RLS: {dashboard.backendReady ? 'CONNECTED' : 'OFFLINE'}</li>
                    <li>Inventory API: ONLINE</li>
                    <li>Order Alerts: TWILIO + GMAIL</li>
                  </ul>
                </div>
                <div className={styles.infoPanel}>
                  <h3>Admin Protocol</h3>
                  <p>Access level: **ROOT**</p>
                  <p>User identifier: {process.env.ADMIN_DASHBOARD_USER || 'homegrownmoney'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
