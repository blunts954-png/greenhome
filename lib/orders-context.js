'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  // Mock initial orders for the demo
  useEffect(() => {
    const savedOrders = localStorage.getItem('hgm_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const mockOrders = [
        {
          id: 'ORD-1001',
          date: new Date().toISOString(),
          customer: { name: 'John Kern', phone: '661-555-0123', address: '123 Truxtun Ave, Bakersfield, CA' },
          items: [{ name: 'HGM Logo Tee - Green', price: 20, quantity: 1 }],
          total: 20,
          type: 'Delivery',
          status: 'Pending'
        },
        {
          id: 'ORD-1002',
          date: new Date().toISOString(),
          customer: { name: 'Sarah Miller', phone: '661-555-0456', address: '' },
          items: [{ name: 'HGM Reserve Flower', price: 45, quantity: 1 }],
          total: 45,
          type: 'Pickup',
          status: 'Pending'
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem('hgm_orders', JSON.stringify(mockOrders));
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
