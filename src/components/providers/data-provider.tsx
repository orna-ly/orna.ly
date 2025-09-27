'use client';

import { useEffect, useRef } from 'react';
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

  // Use refs to prevent infinite re-renders
  const hasLoadedInitialData = useRef(false);
  const hasLoadedAdminData = useRef(false);

  useEffect(() => {
    // Load initial data only once when the app starts
    if (!hasLoadedInitialData.current) {
      hasLoadedInitialData.current = true;
      loadProducts();
      loadSettings();
      loadCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  // Load admin-only data after user authentication is determined
  useEffect(() => {
    if (isAdmin && !hasLoadedAdminData.current) {
      hasLoadedAdminData.current = true;
      loadOrders();
      loadContacts();
    }
  }, [isAdmin, loadOrders, loadContacts]);

  return <>{children}</>;
}
