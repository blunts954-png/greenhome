'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  LogOut,
  Menu,
  Package,
  RefreshCw,
  Search,
  Settings,
  Users,
  X
} from 'lucide-react';

import styles from './Admin.module.css';

const EMPTY_DASHBOARD = {
  backendReady: true,
  orders: [],
  accounts: [],
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    todayOrders: 0,
    revenueToday: 0,
    bannedAccounts: 0,
    bannedIps: 0
  }
};

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);

  const loadDashboard = async () => {
    setIsLoading(true);
    setActionError('');

    try {
      const response = await fetch('/api/admin/dashboard', {
        cache: 'no-store'
      });
      const payload = await response.json();

      if (response.status === 401) {
        setIsAuthenticated(false);
        setDashboard(EMPTY_DASHBOARD);
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to load dashboard data.');
      }

      setDashboard(payload);
    } catch (error) {
      console.error('Dashboard load failed:', error);
      setActionError(error.message || 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const response = await fetch('/api/admin/session', {
          cache: 'no-store'
        });
        const payload = await response.json();

        if (!mounted) {
          return;
        }

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
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Invalid admin key.');
      }

      setPassword('');
      setIsAuthenticated(true);
      await loadDashboard();
    } catch (error) {
      console.error('Admin login failed:', error);
      setLoginError(error.message || 'Unable to log in.');
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/session', {
        method: 'DELETE'
      });
    } finally {
      setIsAuthenticated(false);
      setDashboard(EMPTY_DASHBOARD);
      setActionNotice('');
      setActionError('');
    }
  };

  const handleRefresh = async () => {
    setActionNotice('');
    await loadDashboard();
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    setActionError('');
    setActionNotice('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to update the order.');
      }

      await loadDashboard();
      setActionNotice(`Order ${orderId} marked as ${status}.`);
    } catch (error) {
      console.error('Order update failed:', error);
      setActionError(error.message || 'Unable to update the order.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanToggle = async (account, banned) => {
    const reason = banned
      ? window.prompt('Enter a ban reason for this account:', account.banReason || 'Blocked by admin.')
      : '';

    if (banned && !reason) {
      return;
    }

    setActionError('');
    setActionNotice('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/accounts/${account.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          banned,
          reason
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to update the account.');
      }

      await loadDashboard();
      setActionNotice(
        banned
          ? `Account ${account.email} is now blocked.`
          : `Account ${account.email} has been restored.`
      );
    } catch (error) {
      console.error('Account update failed:', error);
      setActionError(error.message || 'Unable to update the account.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return dashboard.orders;
    }

    return dashboard.orders.filter((order) => {
      const haystack = [
        order.id,
        order.customer?.name,
        order.customer?.email,
        order.customer?.phone,
        order.type,
        order.status
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [dashboard.orders, search]);

  const filteredAccounts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return dashboard.accounts;
    }

    return dashboard.accounts.filter((account) => {
      const haystack = [
        account.name,
        account.email,
        account.phone,
        account.lastIp,
        account.banReason
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [dashboard.accounts, search]);

  if (!authChecked) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <Image src="/logo_v3.jpg" alt="HGM Logo" width={100} height={100} className={styles.loginLogo} />
          <h1>HGM ADMIN</h1>
          <p className={styles.loginHelp}>Checking current session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <Image src="/logo_v3.jpg" alt="HGM Logo" width={100} height={100} className={styles.loginLogo} />
          <h1>HGM ADMIN</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="TERMINAL KEY"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={styles.loginInput}
            />
            <button type="submit" className={styles.loginBtn} disabled={isLoading}>
              {isLoading ? 'ACCESSING...' : 'ACCESS SYSTEM'}
            </button>
          </form>
          {loginError && <p className={styles.loginError}>{loginError}</p>}
          <p className={styles.loginHelp}>The admin key is checked on the server and stored in an HTTP-only session cookie.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.dashboard} ${!isSidebarOpen ? styles.sidebarCollapsed : ''}`}>
      <aside className={styles.sidebar}>
        <div className={styles.sideHeader}>
          <Image src="/logo_v3.jpg" alt="HGM Logo" width={40} height={40} />
          <span>HGM TERMINAL</span>
          <button onClick={() => setIsSidebarOpen(false)} className={styles.collapseBtn}>
            <X size={18} />
          </button>
        </div>

        <nav className={styles.sideNav}>
          <button className={activeTab === 'orders' ? styles.activeSide : ''} onClick={() => setActiveTab('orders')}>
            <Package size={20} /> <span>Orders</span>
          </button>
          <button className={activeTab === 'accounts' ? styles.activeSide : ''} onClick={() => setActiveTab('accounts')}>
            <Users size={20} /> <span>Accounts</span>
          </button>
          <button className={activeTab === 'settings' ? styles.activeSide : ''} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> <span>Settings</span>
          </button>
        </nav>

        <div className={styles.sideFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topHeader}>
          <div className={styles.topHeaderLeft}>
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className={styles.expandBtn}>
                <Menu size={20} />
              </button>
            )}
            <div className={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder={activeTab === 'orders' ? 'Search orders...' : 'Search accounts...'}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.topHeaderActions}>
            <button className={styles.refreshBtn} onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw size={16} />
              {isLoading ? 'Syncing' : 'Refresh'}
            </button>
          </div>
        </header>

        <section className={styles.statsStrip}>
          <div className={styles.statItem}>
            <span className={styles.statVal}>${dashboard.stats.revenueToday.toFixed(2)}</span>
            <span className={styles.statLabel}>TODAY REVENUE</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{dashboard.stats.todayOrders}</span>
            <span className={styles.statLabel}>TODAY ORDERS</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{dashboard.stats.pendingOrders}</span>
            <span className={styles.statLabel}>PENDING</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{dashboard.stats.bannedAccounts}</span>
            <span className={styles.statLabel}>BANNED ACCOUNTS</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{dashboard.stats.bannedIps}</span>
            <span className={styles.statLabel}>BANNED IPS</span>
          </div>
        </section>

        <div className={styles.contentArea}>
          {!dashboard.backendReady && (
            <div className={styles.statusNotice}>
              <AlertCircle size={18} />
              <span>Supabase backend variables are not configured yet, so orders and bans cannot persist.</span>
            </div>
          )}

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
                <h2><Package size={24} /> Orders</h2>
                <p>Server-backed orders with missed pickup enforcement.</p>
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
                          <th>Total</th>
                          <th>Status</th>
                          <th>Pickup</th>
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
                              <div className={styles.secondaryCell}>{order.customer?.email}</div>
                            </td>
                            <td>{order.type}</td>
                            <td>${Number(order.total).toFixed(2)}</td>
                            <td>
                              <span className={`${styles.pill} ${styles[`status${order.status.replace(/\s+/g, '')}`] || styles.statusDefault}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              {order.pickupDeadline ? new Date(order.pickupDeadline).toLocaleString() : 'N/A'}
                            </td>
                            <td>
                              <div className={styles.rowActions}>
                                {order.status === 'Pending' && (
                                  <>
                                    <button className={styles.primaryBtn} onClick={() => handleOrderStatusUpdate(order.id, 'Completed')}>
                                      Complete
                                    </button>
                                    <button className={styles.secondaryBtn} onClick={() => handleOrderStatusUpdate(order.id, 'Cancelled')}>
                                      Cancel
                                    </button>
                                  </>
                                )}
                                {order.status !== 'Pending' && <span className={styles.secondaryCell}>Locked</span>}
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

          {activeTab === 'accounts' && (
            <div className={styles.view}>
              <div className={styles.viewHeader}>
                <h2><Users size={24} /> Accounts</h2>
                <p>Email, phone, and IP-backed ban controls.</p>
              </div>

              {filteredAccounts.length === 0 ? (
                <div className={styles.emptyState}>
                  <Users size={42} />
                  <p>No matching accounts.</p>
                </div>
              ) : (
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

                      <div className={styles.accountMeta}>
                        <p><strong>Last IP:</strong> {account.lastIp || 'Unknown'}</p>
                        <p><strong>Missed pickups:</strong> {account.missedPickups || 0}</p>
                        <p><strong>Last order:</strong> {account.lastOrderAt ? new Date(account.lastOrderAt).toLocaleString() : 'No orders yet'}</p>
                        {account.banReason && <p><strong>Reason:</strong> {account.banReason}</p>}
                      </div>

                      <div className={styles.rowActions}>
                        {account.banned ? (
                          <button className={styles.primaryBtn} onClick={() => handleBanToggle(account, false)}>
                            Restore
                          </button>
                        ) : (
                          <button className={styles.secondaryBtn} onClick={() => handleBanToggle(account, true)}>
                            Ban Account + IP
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles.view}>
              <div className={styles.viewHeader}>
                <h2><Settings size={24} /> Backend</h2>
                <p>Deployment and enforcement notes for the live store.</p>
              </div>

              <div className={styles.panelGrid}>
                <div className={styles.infoPanel}>
                  <h3>Required Variables</h3>
                  <ul className={styles.infoList}>
                    <li>`NEXT_PUBLIC_SUPABASE_URL`</li>
                    <li>`NEXT_PUBLIC_SUPABASE_ANON_KEY`</li>
                    <li>`SUPABASE_SERVICE_ROLE_KEY`</li>
                    <li>`ADMIN_DASHBOARD_KEY`</li>
                    <li>`CRON_SECRET`</li>
                  </ul>
                </div>

                <div className={styles.infoPanel}>
                  <h3>Automatic Ban Sweep</h3>
                  <p>
                    Vercel cron calls <code>/api/cron/enforce-bans</code> every 15 minutes. Pickup orders past
                    the 9:30 PM deadline are marked as missed, and the linked account plus stored IP are blocked.
                  </p>
                </div>

                <div className={styles.infoPanel}>
                  <h3>Database Setup</h3>
                  <p>
                    Apply <code>supabase/migrations/20260319_store_backend.sql</code> in the Supabase SQL editor
                    before turning the live site back on.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
