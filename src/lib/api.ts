import type {
  ApiResponse,
  Contact,
  Order,
  OrderItem,
  Product,
} from '@/lib/types';
import type { CreateContactInput, CreateOrderInput } from '@/lib/validations';

interface FetchProductsParams {
  featured?: boolean;
  search?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

interface FetchOrdersParams {
  status?: string;
  paymentStatus?: string;
  customerName?: string;
  page?: number;
  limit?: number;
}

interface FetchContactsParams {
  status?: string;
  page?: number;
  limit?: number;
}

interface ApiSuccessEnvelope<T> {
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const JSON_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toRecordOfStrings(value: unknown): Record<string, string> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => typeof v === 'string')
  ) as Record<string, string>;
}

function toOptionalLocalized(
  value: unknown
): Record<string, string> | undefined {
  const localized = toRecordOfStrings(value);
  return Object.keys(localized).length > 0 ? localized : undefined;
}

function toLocalizedStringArray(
  value: unknown
): Record<string, string[]> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const mapped = Object.entries(value).reduce(
    (acc, [key, entry]) => {
      if (Array.isArray(entry)) {
        const values = entry.filter(
          (item): item is string =>
            typeof item === 'string' && item.trim().length > 0
        );
        if (values.length > 0) {
          acc[key] = values;
        }
      }
      return acc;
    },
    {} as Record<string, string[]>
  );

  return Object.keys(mapped).length > 0 ? mapped : undefined;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function parseDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }

  const date = new Date(
    typeof value === 'string' ? value : String(value ?? '')
  );
  return Number.isNaN(date.valueOf()) ? new Date() : date;
}

function normalizeProduct(payload: unknown): Product {
  if (!isRecord(payload)) {
    throw new Error('Invalid product payload received from server');
  }

  return {
    id: String(payload.id ?? ''),
    name: toRecordOfStrings(payload.name),
    slug: String(payload.slug ?? ''),
    price:
      typeof payload.price === 'number'
        ? payload.price
        : Number(payload.price ?? 0),
    priceBeforeDiscount:
      payload.priceBeforeDiscount !== null &&
      payload.priceBeforeDiscount !== undefined
        ? Number(payload.priceBeforeDiscount)
        : undefined,
    discountPercentage:
      payload.discountPercentage !== null &&
      payload.discountPercentage !== undefined
        ? Number(payload.discountPercentage)
        : undefined,
    images: toStringArray(payload.images),
    description: toRecordOfStrings(payload.description),
    subtitle: toOptionalLocalized(payload.subtitle),
    subdescription: toOptionalLocalized(payload.subdescription),
    featured: Boolean(payload.featured),
    wrappingPrice:
      payload.wrappingPrice !== null && payload.wrappingPrice !== undefined
        ? Number(payload.wrappingPrice)
        : undefined,
    stockQuantity:
      typeof payload.stockQuantity === 'number'
        ? payload.stockQuantity
        : undefined,
    category:
      typeof payload.category === 'string'
        ? (payload.category as Product['category'])
        : 'NATURAL_PEARLS',
    tags: toLocalizedStringArray(payload.tags),
    highlights: toLocalizedStringArray(payload.highlights),
    status:
      typeof payload.status === 'string'
        ? (payload.status as Product['status'])
        : 'ACTIVE',
    createdAt: parseDate(payload.createdAt),
    updatedAt: parseDate(payload.updatedAt),
  };
}

function normalizeContact(payload: unknown): Contact {
  if (!isRecord(payload)) {
    throw new Error('Invalid contact payload received from server');
  }

  const phone =
    typeof payload.phone === 'string' && payload.phone.trim().length > 0
      ? payload.phone
      : undefined;

  return {
    id: String(payload.id ?? ''),
    name: String(payload.name ?? ''),
    email: String(payload.email ?? ''),
    phone,
    subject: String(payload.subject ?? ''),
    message: String(payload.message ?? ''),
    status:
      typeof payload.status === 'string'
        ? (payload.status as Contact['status'])
        : 'NEW',
    createdAt: parseDate(payload.createdAt),
    updatedAt: parseDate(payload.updatedAt),
  };
}

function normalizeOrderItem(payload: unknown): OrderItem {
  if (!isRecord(payload)) {
    throw new Error('Invalid order item payload received from server');
  }

  return {
    id: String(payload.id ?? ''),
    quantity:
      typeof payload.quantity === 'number'
        ? payload.quantity
        : Number(payload.quantity ?? 0),
    unitPrice:
      typeof payload.unitPrice === 'number'
        ? payload.unitPrice
        : Number(payload.unitPrice ?? 0),
    totalPrice:
      typeof payload.totalPrice === 'number'
        ? payload.totalPrice
        : Number(payload.totalPrice ?? 0),
    product: normalizeProduct(payload.product),
  };
}

function normalizeOrder(payload: unknown): Order {
  if (!isRecord(payload)) {
    throw new Error('Invalid order payload received from server');
  }

  const shippingAddress = isRecord(payload.shippingAddress)
    ? Object.fromEntries(
        Object.entries(payload.shippingAddress).filter(
          ([, value]) => typeof value === 'string' && value.trim().length > 0
        )
      )
    : {};

  const customerEmail =
    typeof payload.customerEmail === 'string' &&
    payload.customerEmail.trim().length > 0
      ? payload.customerEmail
      : undefined;

  const paymentUrl =
    typeof payload.paymentUrl === 'string' && payload.paymentUrl.length > 0
      ? payload.paymentUrl
      : undefined;

  const paymentReference =
    typeof payload.paymentReference === 'string' &&
    payload.paymentReference.length > 0
      ? payload.paymentReference
      : undefined;

  const paymentMethod =
    typeof payload.paymentMethod === 'string' &&
    payload.paymentMethod.length > 0
      ? payload.paymentMethod
      : undefined;

  const notes =
    typeof payload.notes === 'string' && payload.notes.trim().length > 0
      ? payload.notes
      : undefined;

  const items = Array.isArray(payload.items)
    ? payload.items.map(normalizeOrderItem)
    : [];

  return {
    id: String(payload.id ?? ''),
    orderNumber: String(payload.orderNumber ?? ''),
    customerName: String(payload.customerName ?? ''),
    customerPhone: String(payload.customerPhone ?? ''),
    customerEmail,
    shippingAddress,
    totalAmount:
      typeof payload.totalAmount === 'number'
        ? payload.totalAmount
        : Number(payload.totalAmount ?? 0),
    wrappingCost:
      payload.wrappingCost !== null && payload.wrappingCost !== undefined
        ? Number(payload.wrappingCost)
        : undefined,
    needsWrapping: Boolean(payload.needsWrapping),
    paymentStatus:
      typeof payload.paymentStatus === 'string'
        ? (payload.paymentStatus as Order['paymentStatus'])
        : 'PENDING',
    paymentUrl,
    paymentReference,
    paymentMethod,
    status:
      typeof payload.status === 'string'
        ? (payload.status as Order['status'])
        : 'PENDING',
    notes,
    createdAt: parseDate(payload.createdAt),
    updatedAt: parseDate(payload.updatedAt),
    items,
  };
}

function extractErrorMessage(body: unknown, response: Response): string {
  if (isRecord(body)) {
    if (typeof body.error === 'string' && body.error.trim().length > 0) {
      return body.error;
    }
    if (typeof body.message === 'string' && body.message.trim().length > 0) {
      return body.message;
    }
  }

  return `Request failed with status ${response.status}`;
}

function parsePagination(value: unknown): ApiResponse<unknown>['pagination'] {
  if (!isRecord(value)) {
    return undefined;
  }

  const { page, limit, total, totalPages } = value;
  if (
    typeof page === 'number' &&
    typeof limit === 'number' &&
    typeof total === 'number' &&
    typeof totalPages === 'number'
  ) {
    return { page, limit, total, totalPages };
  }

  return undefined;
}

async function parseResponse<T>(
  response: Response,
  transform: (payload: unknown) => T
): Promise<ApiResponse<T>> {
  let body: unknown = null;

  try {
    body = await response.json();
  } catch (error) {
    if (response.status !== 204) {
      return {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to parse server response',
      };
    }
  }

  if (!response.ok) {
    return { error: extractErrorMessage(body, response) };
  }

  if (!isRecord(body)) {
    return { error: 'Malformed server response received' };
  }

  const payload =
    'data' in body ? (body as ApiSuccessEnvelope<unknown>).data : body;

  let data: T;
  try {
    data = transform(payload);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to transform server response',
    };
  }

  const message = typeof body.message === 'string' ? body.message : undefined;
  const pagination = parsePagination(body.pagination);

  return { data, message, pagination };
}

// Products API
export async function fetchProducts(
  params?: FetchProductsParams
): Promise<ApiResponse<Product[]>> {
  const searchParams = new URLSearchParams();

  if (params?.featured !== undefined) {
    searchParams.set('featured', String(params.featured));
  }
  if (params?.search) {
    searchParams.set('search', params.search);
  }
  if (params?.status) {
    searchParams.set('status', params.status);
  }
  if (params?.minPrice !== undefined) {
    searchParams.set('minPrice', String(params.minPrice));
  }
  if (params?.maxPrice !== undefined) {
    searchParams.set('maxPrice', String(params.maxPrice));
  }
  if (params?.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params?.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  const query = searchParams.toString();
  const response = await fetch(`/api/products${query ? `?${query}` : ''}`);

  return parseResponse(response, (payload) => {
    if (!Array.isArray(payload)) {
      throw new Error('Expected product list in server response');
    }

    return payload.map(normalizeProduct);
  });
}

export async function fetchProduct(id: string): Promise<ApiResponse<Product>> {
  const response = await fetch(`/api/products/${id}`);

  return parseResponse(response, normalizeProduct);
}

export async function fetchProductBySlug(
  slug: string
): Promise<ApiResponse<Product>> {
  const response = await fetch(`/api/products/slug/${slug}`);

  return parseResponse(response, normalizeProduct);
}

// Orders API
export async function fetchOrders(
  params?: FetchOrdersParams
): Promise<ApiResponse<Order[]>> {
  const searchParams = new URLSearchParams();

  if (params?.status) {
    searchParams.set('status', params.status);
  }
  if (params?.paymentStatus) {
    searchParams.set('paymentStatus', params.paymentStatus);
  }
  if (params?.customerName) {
    searchParams.set('customerName', params.customerName);
  }
  if (params?.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params?.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  const query = searchParams.toString();
  const response = await fetch(`/api/orders${query ? `?${query}` : ''}`, {
    credentials: 'include',
  });

  return parseResponse(response, (payload) => {
    if (!Array.isArray(payload)) {
      throw new Error('Expected order list in server response');
    }

    return payload.map(normalizeOrder);
  });
}

export async function createOrder(
  orderData: CreateOrderInput
): Promise<ApiResponse<Order>> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(orderData),
  });

  return parseResponse(response, normalizeOrder);
}

// Contacts API
export async function fetchContacts(
  params?: FetchContactsParams
): Promise<ApiResponse<Contact[]>> {
  const searchParams = new URLSearchParams();

  if (params?.status) {
    searchParams.set('status', params.status);
  }
  if (params?.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params?.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  const query = searchParams.toString();
  const response = await fetch(`/api/contacts${query ? `?${query}` : ''}`, {
    credentials: 'include',
  });

  return parseResponse(response, (payload) => {
    if (!Array.isArray(payload)) {
      throw new Error('Expected contact list in server response');
    }

    return payload.map(normalizeContact);
  });
}

export async function createContact(
  contactData: CreateContactInput
): Promise<ApiResponse<Contact>> {
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(contactData),
  });

  return parseResponse(response, normalizeContact);
}
