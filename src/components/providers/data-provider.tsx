"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  loadProductsAtom,
  loadOrdersAtom,
  loadContactsAtom,
  loadSettingsAtom,
} from "@/lib/atoms";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [, loadProducts] = useAtom(loadProductsAtom);
  const [, loadOrders] = useAtom(loadOrdersAtom);
  const [, loadContacts] = useAtom(loadContactsAtom);
  const [, loadSettings] = useAtom(loadSettingsAtom);

  useEffect(() => {
    // Load initial data when the app starts
    loadProducts();
    loadOrders();
    loadContacts();
    loadSettings();
  }, [loadProducts, loadOrders, loadContacts, loadSettings]);

  return <>{children}</>;
}
