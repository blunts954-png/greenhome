'use client';

import { useState, useEffect } from 'react';
import styles from './POS.module.css';
import { Search, ShoppingCart, Tag, User, Package, CreditCard, RotateCcw } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Rooted Hoodie - Black', price: 85.00, stock: 24, category: 'Hoodies' },
  { id: 2, name: 'Home Grown Money Classic Tee', price: 45.00, stock: 45, category: 'Tees' },
  { id: 3, name: 'Plant it Cap', price: 35.00, stock: 12, category: 'Accessories' },
  { id: 4, name: 'Home Grown Money Heavyweight Sweats', price: 75.00, stock: 20, category: 'Sweats' },
  { id: 5, name: 'Rooted Beanie', price: 30.00, stock: 50, category: 'Accessories' },
];

export default function POSSystem() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={styles.posContainer}>
      {/* Sidebar Nav */}
      <aside className={styles.sidebar}>
        <div className={styles.adminLogo}>Home Grown Money POS</div>
        <nav>
          <button className={styles.navItem}><Package size={20}/> Inventory</button>
          <button className={styles.navItem}><User size={20}/> Customers</button>
          <button className={styles.navItem}><Tag size={20}/> Discounts</button>
          <button className={`${styles.navItem} ${styles.active}`}><CreditCard size={20}/> Register</button>
        </nav>
      </aside>

      {/* Main Register Area */}
      <main className={styles.register}>
        <header className={styles.header}>
          <div className={styles.searchBar}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search products or scan barcode..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.userProfile}>
            <span>Cashier: Admin</span>
          </div>
        </header>

        <div className={styles.categoryFilters}>
          {['All', 'Hoodies', 'Tees', 'Accessories', 'Sweats'].map(cat => (
            <button 
              key={cat} 
              className={activeCategory === cat ? styles.catActive : ''}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.productGrid}>
          {MOCK_PRODUCTS.filter(p => activeCategory === 'All' || p.category === activeCategory).map(product => (
            <div key={product.id} className={styles.productCard} onClick={() => addToCart(product)}>
              <div className={styles.stockBadge}>{product.stock} in stock</div>
              <h3>{product.name}</h3>
              <p className={styles.price}>${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Area */}
      <section className={styles.cartSection}>
        <div className={styles.cartHeader}>
          <h2>Current Order</h2>
          <button onClick={() => setCart([])}><RotateCcw size={16}/></button>
        </div>

        <div className={styles.orderList}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingCart size={48} />
              <p>Scan items to add to order</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className={styles.itemActions}>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.checkoutFooter}>
          <div className={styles.summary}>
            <div className={styles.sumRow}><span>Subtotal</span> <span>${total.toFixed(2)}</span></div>
            <div className={styles.sumRow}><span>Tax (8%)</span> <span>${(total * 0.08).toFixed(2)}</span></div>
            <div className={`${styles.sumRow} ${styles.totalRow}`}><span>Total</span> <span>${(total * 1.08).toFixed(2)}</span></div>
          </div>
          <div className={styles.actionButtons}>
            <button className={`${styles.checkoutBtn} ${styles.pickupBtn}`} disabled={cart.length === 0}>
              Cash on Pick Up
            </button>
            <button className={`${styles.checkoutBtn} ${styles.deliverBtn}`} disabled={cart.length === 0}>
              Cash on Delivery
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
