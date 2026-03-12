'use client';

import { useCart } from '@/lib/cart-context';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { cartItems, cartTotal, isDrawerOpen, toggleDrawer, removeFromCart } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className={styles.overlay} onClick={toggleDrawer}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <ShoppingBag size={20} className={styles.titleIcon} />
            <h2 className="brand-font">Your Bag</h2>
          </div>
          <button className={styles.closeBtn} onClick={toggleDrawer}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.itemsContainer}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Your bag is currently empty.</p>
              <button className={styles.continueShop} onClick={toggleDrawer}>Continue Shopping</button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${item.selectedSize}`} className={styles.cartItem}>
                <div className={styles.itemImg}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className={styles.itemMeta}>
                  <h3>{item.name}</h3>
                  <p className={styles.sizeInfo}>Size: {item.selectedSize}</p>
                  <p className={styles.quantity}>Qty: {item.quantity}</p>
                  <p className={styles.price}>${item.price * item.quantity}</p>
                </div>
                <button 
                  className={styles.removeBtn} 
                  onClick={() => removeFromCart(item.id, item.selectedSize)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span className={styles.totalAmount}>${cartTotal}</span>
            </div>
            <p className={styles.shippingNotice}>Shipping & taxes calculated at checkout</p>
            <button className={styles.checkoutBtn}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}
