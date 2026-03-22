'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [backendReady, setBackendReady] = useState(true);

  const addOrder = async (order) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });

      const payload = await response.json();

      if (!response.ok) {
        setBackendReady(response.status !== 503);
        return {
          error: payload.error || 'Unable to submit the order.',
          code: payload.code || 'ORDER_CREATE_FAILED'
        };
      }

      setBackendReady(true);

      if (payload.order) {
        setOrders((current) => [
          payload.order,
          ...current.filter((entry) => entry.id !== payload.order.id)
        ]);
      }

      if (payload.account) {
        setAccounts((current) => [
          payload.account,
          ...current.filter((entry) => entry.id !== payload.account.id)
        ]);
      }

      return payload.order;
    } catch (error) {
      console.error('Order request failed:', error);

      return {
        error: 'Unable to reach the checkout backend right now.',
        code: 'ORDER_NETWORK_FAILED'
      };
    }
  };

  const isAccountBlocked = async (email, phone) => {
    try {
      const response = await fetch('/api/accounts/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, phone })
      });

      const payload = await response.json();

      if (!response.ok) {
        setBackendReady(response.status !== 503);
        return {
          banReason: payload.error || 'Unable to verify account status.',
          code: payload.code || 'ACCOUNT_CHECK_FAILED'
        };
      }

      setBackendReady(true);

      if (!payload.blocked) {
        return null;
      }

      return {
        ...payload.account,
        source: payload.source,
        banReason: payload.banReason
      };
    } catch (error) {
      console.error('Account status check failed:', error);

      return {
        banReason: 'Unable to verify account status right now.',
        code: 'ACCOUNT_CHECK_NETWORK_FAILED'
      };
    }
  };

  const value = useMemo(
    () => ({
      orders,
      accounts,
      backendReady,
      addOrder,
      updateOrderStatus: () => null,
      isAccountBlocked
    }),
    [orders, accounts, backendReady]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  return useContext(OrdersContext) || {
    orders: [],
    accounts: [],
    backendReady: true,
    addOrder: async () => ({ error: 'Orders provider is unavailable.' }),
    updateOrderStatus: () => null,
    isAccountBlocked: async () => null
  };
}
