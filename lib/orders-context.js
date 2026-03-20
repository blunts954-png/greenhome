'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('hgm_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to parse saved orders', error);
        setOrders([]);
      }
    }
  }, []);

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString(),
      status: 'Pending'
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('hgm_orders', JSON.stringify(updatedOrders));
    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updatedOrders);
    localStorage.setItem('hgm_orders', JSON.stringify(updatedOrders));
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}
