import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { fetchProducts, fetchOrders, fetchContacts } from "./api";

// Types
export interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: number;
  priceBeforeDiscount?: number;
  images: string[];
  description: Record<string, string>;
  subtitle?: Record<string, string>;
  subdescription?: Record<string, string>;
  featured: boolean;
  wrappingPrice?: number;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: Record<string, string>;
  totalAmount: number;
  wrappingCost?: number;
  needsWrapping: boolean;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentUrl?: string;
  paymentMethod?: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Product;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "NEW" | "REPLIED" | "RESOLVED";
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Global State Atoms
export const currentLangAtom = atomWithStorage<string>("currentLang", "ar");

// Data Atoms
export const productsAtom = atom<Product[]>([]);
export const featuredProductsAtom = atom<Product[]>((get) =>
  get(productsAtom).filter((p) => p.featured)
);

export const cartItemsAtom = atomWithStorage<CartItem[]>("cartItems", []);
export const cartTotalAtom = atom((get) =>
  get(cartItemsAtom).reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
);

export const ordersAtom = atom<Order[]>([]);
export const contactsAtom = atom<Contact[]>([]);

// UI State Atoms
export const mobileMenuOpenAtom = atom(false);
export const loadingAtom = atom(false);
export const searchQueryAtom = atom("");
export const filterCategoryAtom = atom<string>("all");

// Data Loading Atoms
export const loadProductsAtom = atom(null, async (get, set) => {
  set(loadingAtom, true);
  try {
    const result = await fetchProducts();
    if (result.data) {
      set(productsAtom, result.data as Product[]);
    } else {
      console.error("Failed to load products:", result.error);
    }
  } catch (error) {
    console.error("Error loading products:", error);
  } finally {
    set(loadingAtom, false);
  }
});

export const loadOrdersAtom = atom(null, async (get, set) => {
  set(loadingAtom, true);
  try {
    const result = await fetchOrders();
    if (result.data) {
      // TODO: fix this typing
      set(ordersAtom, result.data as unknown as Order[]);
    } else {
      console.error("Failed to load orders:", result.error);
    }
  } catch (error) {
    console.error("Error loading orders:", error);
  } finally {
    set(loadingAtom, false);
  }
});

export const loadContactsAtom = atom(null, async (get, set) => {
  set(loadingAtom, true);
  try {
    const result = await fetchContacts();
    if (result.data) {
      set(contactsAtom, result.data as Contact[]);
    } else {
      console.error("Failed to load contacts:", result.error);
    }
  } catch (error) {
    console.error("Error loading contacts:", error);
  } finally {
    set(loadingAtom, false);
  }
});

// Cart Actions
export const addToCartAtom = atom(null, (get, set, product: Product) => {
  const currentItems = get(cartItemsAtom);
  const existingItem = currentItems.find(
    (item) => item.product.id === product.id
  );

  if (existingItem) {
    const updatedItems = currentItems.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
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
    const updatedItems = currentItems.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    set(cartItemsAtom, updatedItems);
  }
);
