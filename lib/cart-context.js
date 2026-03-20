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
    const quantityToAdd = Math.max(1, product.quantity || 1);

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && item.selectedSize === product.selectedSize
      );

      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += quantityToAdd;
        return newItems;
      }
      return [...prev, { ...product, quantity: quantityToAdd }];
    });
    setIsDrawerOpen(true);
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
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartCount: 0,
      cartItems: [],
      cartTotal: 0,
      addToCart: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      isDrawerOpen: false,
      toggleDrawer: () => {}
    };
  }
  return context;
}
