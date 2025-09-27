// Shared type definitions for the application

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  image?: string;
}

export interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: number;
  priceBeforeDiscount?: number;
  discountPercentage?: number;
  images: string[];
  description: Record<string, string>;
  subtitle?: Record<string, string>;
  subdescription?: Record<string, string>;
  featured: boolean;
  wrappingPrice?: number;
  stockQuantity?: number;
  category: 'NATURAL_PEARLS' | 'ARTIFICIAL_PEARLS';
  tags?: Record<string, string[]>;
  highlights?: Record<string, string[]>;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
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
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentUrl?: string;
  paymentMethod?: string;
  paymentReference?: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';
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
  status: 'NEW' | 'REPLIED' | 'RESOLVED';
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SettingKV<T = unknown> {
  key: string;
  value: T;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Navigation types
export interface NavigationItem {
  name: { ar: string; en: string };
  href: string;
  children?: Array<{
    name: { ar: string; en: string };
    href: string;
  }>;
}

// Language types
export type Language = 'ar' | 'en';

// Theme types
export type ColorScheme =
  | 'amber'
  | 'blue'
  | 'green'
  | 'purple'
  | 'red'
  | 'neutral';

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LocalizedComponentProps extends BaseComponentProps {
  currentLang: Language;
}
