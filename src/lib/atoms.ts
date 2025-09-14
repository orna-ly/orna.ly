import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// Types
export interface Product {
  id: string
  name: Record<string, string>
  slug: string
  price: number
  priceBeforeDiscount?: number
  images: string[]
  description: Record<string, string>
  subtitle?: Record<string, string>
  subdescription?: Record<string, string>
  featured: boolean
  wrappingPrice?: number
  createdAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  address: string
  city: string
  state?: string
  product: Product
  quantity: number
  totalAmount: number
  wrapping: boolean
  wrappingPrice?: number
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED'
  paymentUrl?: string
  status: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  notes?: string
  createdAt: Date
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'NEW' | 'READ' | 'REPLIED'
  createdAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
}

// Global State Atoms
export const currentLangAtom = atomWithStorage<string>('currentLang', 'ar')

export const productsAtom = atom<Product[]>([])
export const featuredProductsAtom = atom<Product[]>(
  (get) => get(productsAtom).filter(p => p.featured)
)

export const cartItemsAtom = atomWithStorage<CartItem[]>('cartItems', [])
export const cartTotalAtom = atom(
  (get) => get(cartItemsAtom).reduce((total, item) => 
    total + (item.product.price * item.quantity), 0
  )
)

export const ordersAtom = atom<Order[]>([])
export const contactsAtom = atom<Contact[]>([])

// UI State Atoms
export const mobileMenuOpenAtom = atom(false)
export const loadingAtom = atom(false)
export const searchQueryAtom = atom('')
export const filterCategoryAtom = atom<string>('all')

// Cart Actions
export const addToCartAtom = atom(
  null,
  (get, set, product: Product) => {
    const currentItems = get(cartItemsAtom)
    const existingItem = currentItems.find(item => item.product.id === product.id)
    
    if (existingItem) {
      const updatedItems = currentItems.map(item =>
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      set(cartItemsAtom, updatedItems)
    } else {
      set(cartItemsAtom, [...currentItems, { product, quantity: 1 }])
    }
  }
)

export const removeFromCartAtom = atom(
  null,
  (get, set, productId: string) => {
    const currentItems = get(cartItemsAtom)
    const updatedItems = currentItems.filter(item => item.product.id !== productId)
    set(cartItemsAtom, updatedItems)
  }
)

export const updateCartQuantityAtom = atom(
  null,
  (get, set, { productId, quantity }: { productId: string; quantity: number }) => {
    const currentItems = get(cartItemsAtom)
    const updatedItems = currentItems.map(item =>
      item.product.id === productId 
        ? { ...item, quantity }
        : item
    )
    set(cartItemsAtom, updatedItems)
  }
)
