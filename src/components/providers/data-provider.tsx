'use client'

import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { loadProductsAtom, loadOrdersAtom, loadContactsAtom } from '@/lib/atoms'

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [, loadProducts] = useAtom(loadProductsAtom)
  const [, loadOrders] = useAtom(loadOrdersAtom)
  const [, loadContacts] = useAtom(loadContactsAtom)

  useEffect(() => {
    // Load initial data when the app starts
    loadProducts()
    loadOrders()
    loadContacts()
  }, [loadProducts, loadOrders, loadContacts])

  return <>{children}</>
}
