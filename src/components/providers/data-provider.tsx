'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  loadProductsAtom,
  loadOrdersAtom,
  loadContactsAtom,
  loadSettingsAtom,
  loadCurrentUserAtom,
  isAdminAtom,
} from '@/lib/atoms';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [, loadProducts] = useAtom(loadProductsAtom);
  const [, loadOrders] = useAtom(loadOrdersAtom);
  const [, loadContacts] = useAtom(loadContactsAtom);
  const [, loadSettings] = useAtom(loadSettingsAtom);
  const [, loadCurrentUser] = useAtom(loadCurrentUserAtom);
  const [isAdmin] = useAtom(isAdminAtom);

  useEffect(() => {
    // Load initial data when the app starts
    loadProducts();
    loadSettings();
    loadCurrentUser(); // Load user first
  }, [loadProducts, loadSettings, loadCurrentUser]);

  // Load admin-only data after user authentication is determined
  useEffect(() => {
    if (isAdmin) {
      loadOrders();
      loadContacts();
    }
  }, [isAdmin, loadOrders, loadContacts]);

  return <>{children}</>;
}
