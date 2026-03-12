'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('hgm-cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hgm-cart', JSON.stringify(cartItems));
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      // Find if item with SAME ID AND SAME SIZE already exists
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && item.selectedSize === product.selectedSize
      );

      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += 1;
        return newItems;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsDrawerOpen(true); // Open drawer on add
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === productId && item.selectedSize === size)
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      cartItems, 
      cartTotal,
      addToCart, 
      removeFromCart, 
      clearCart, 
      isDrawerOpen, 
      toggleDrawer 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
