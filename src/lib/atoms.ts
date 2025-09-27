import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { fetchProducts, fetchOrders, fetchContacts } from './api';
import { showToast } from './toast';
import type {
  Product,
  Order,
  Contact,
  SettingKV,
  CartItem,
  User,
} from './types';

export type {
  Product,
  Order,
  Contact,
  SettingKV,
  CartItem,
  User,
} from './types';
export type { OrderItem } from './types';

// Global State Atoms
export const currentLangAtom = atomWithStorage<string>('currentLang', 'ar');

// User Authentication Atoms
export const currentUserAtom = atom<User | null>(null);
export const isLoggedInAtom = atom((get) => !!get(currentUserAtom));
export const isAdminAtom = atom((get) => {
  const user = get(currentUserAtom);
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
});

// Data Atoms
export const productsAtom = atom<Product[]>([]);
export const featuredProductsAtom = atom<Product[]>((get) => {
  const products = get(productsAtom);
  return Array.isArray(products) ? products.filter((p) => p.featured) : [];
});

export const cartItemsAtom = atomWithStorage<CartItem[]>('cartItems', []);
export const cartTotalAtom = atom((get) =>
  get(cartItemsAtom).reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
);

export const ordersAtom = atom<Order[]>([]);
export const contactsAtom = atom<Contact[]>([]);
export const settingsAtom = atom<Record<string, unknown>>({});

// UI State Atoms
export const mobileMenuOpenAtom = atom(false);
export const loadingAtom = atom(false);
export const searchQueryAtom = atom('');
export const filterCategoryAtom = atom<string>('all');

// Resource-scoped loading and error states for better UI control
export const productsLoadingAtom = atom(false);
export const productsErrorAtom = atom<string | null>(null);
export const ordersLoadingAtom = atom(false);
export const ordersErrorAtom = atom<string | null>(null);
export const contactsLoadingAtom = atom(false);
export const contactsErrorAtom = atom<string | null>(null);

// Data Loading Atoms
export const loadProductsAtom = atom(null, async (get, set) => {
  set(productsLoadingAtom, true);
  set(productsErrorAtom, null);
  try {
    const result = await fetchProducts();
    if (result.data) {
      set(productsAtom, result.data);
    } else {
      console.error('Failed to load products:', result.error);
      set(productsErrorAtom, result.error || 'Failed to load products');
    }
  } catch (error) {
    console.error('Error loading products:', error);
    set(productsErrorAtom, 'Error loading products');
  } finally {
    set(productsLoadingAtom, false);
  }
});

export const loadOrdersAtom = atom(null, async (get, set) => {
  set(ordersLoadingAtom, true);
  set(ordersErrorAtom, null);
  try {
    const result = await fetchOrders();
    if (result.data) {
      set(ordersAtom, result.data);
    } else {
      console.error('Failed to load orders:', result.error);
      set(ordersErrorAtom, result.error || 'Failed to load orders');
    }
  } catch (error) {
    console.error('Error loading orders:', error);
    set(ordersErrorAtom, 'Error loading orders');
  } finally {
    set(ordersLoadingAtom, false);
  }
});

export const loadContactsAtom = atom(null, async (get, set) => {
  set(contactsLoadingAtom, true);
  set(contactsErrorAtom, null);
  try {
    const result = await fetchContacts();
    if (result.data) {
      set(contactsAtom, result.data);
    } else {
      console.error('Failed to load contacts:', result.error);
      set(contactsErrorAtom, result.error || 'Failed to load contacts');
    }
  } catch (error) {
    console.error('Error loading contacts:', error);
    set(contactsErrorAtom, 'Error loading contacts');
  } finally {
    set(contactsLoadingAtom, false);
  }
});

// Settings Loading Atom
export const loadSettingsAtom = atom(null, async (get, set) => {
  set(loadingAtom, true);
  try {
    const response = await fetch('/api/settings');
    if (!response.ok) throw new Error('Failed to fetch settings');
    const data = (await response.json()) as SettingKV<unknown>[];
    const map: Record<string, unknown> = {};
    data.forEach((s) => {
      map[s.key] = s.value;
    });
    set(settingsAtom, map);
  } catch (error) {
    console.error('Error loading settings:', error);
  } finally {
    set(loadingAtom, false);
  }
});

// User Authentication Loading Atom
export const loadCurrentUserAtom = atom(null, async (get, set) => {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include', // Include cookies for authentication
    });
    if (response.ok) {
      const user = await response.json();
      set(currentUserAtom, user);
    } else {
      set(currentUserAtom, null);
    }
  } catch (error) {
    console.error('Error loading current user:', error);
    set(currentUserAtom, null);
  }
});

// Logout Action
export const logoutAtom = atom(null, async (get, set) => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies for authentication
    });
    set(currentUserAtom, null);
  } catch (error) {
    console.error('Error logging out:', error);
  }
});

// Cart Actions
export const addToCartAtom = atom(null, (get, set, product: Product) => {
  const currentItems = get(cartItemsAtom);
  const currentLang = get(currentLangAtom);
  const availableStock = product.stockQuantity ?? 0;

  if (availableStock <= 0) {
    showToast.error(
      currentLang === 'ar'
        ? 'هذا المنتج غير متوفر حالياً'
        : 'This product is currently sold out'
    );
    return;
  }

  const existingItem = currentItems.find(
    (item) => item.product.id === product.id
  );

  const nextQuantity = existingItem ? existingItem.quantity + 1 : 1;

  if (nextQuantity > availableStock) {
    showToast.error(
      currentLang === 'ar'
        ? 'لقد وصلت إلى الحد الأقصى للكمية المتاحة'
        : 'You have reached the available stock limit'
    );
    return;
  }

  if (existingItem) {
    const updatedItems = currentItems.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: nextQuantity }
        : item
    );
    set(cartItemsAtom, updatedItems);
  } else {
    set(cartItemsAtom, [...currentItems, { product, quantity: 1 }]);
  }
});

export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  const currentItems = get(cartItemsAtom);
  const updatedItems = currentItems.filter(
    (item) => item.product.id !== productId
  );
  set(cartItemsAtom, updatedItems);
});

export const updateCartQuantityAtom = atom(
  null,
  (
    get,
    set,
    { productId, quantity }: { productId: string; quantity: number }
  ) => {
    const currentItems = get(cartItemsAtom);
    const currentLang = get(currentLangAtom);

    const updatedItems = currentItems
      .map((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        const stockLimit = item.product.stockQuantity ?? 0;

        if (quantity <= 0) {
          return null;
        }

        if (stockLimit > 0 && quantity > stockLimit) {
          showToast.error(
            currentLang === 'ar'
              ? 'لا تتوفر هذه الكمية في المخزون'
              : 'Requested quantity exceeds available stock'
          );
          return { ...item, quantity: stockLimit };
        }

        return { ...item, quantity };
      })
      .filter((item): item is CartItem => item !== null);

    set(cartItemsAtom, updatedItems);
  }
);
