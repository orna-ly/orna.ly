import { Contact, Order, Product } from "@/generated/prisma";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Products API
export async function fetchProducts(params?: {
  featured?: boolean;
  search?: string;
  limit?: number;
}): Promise<ApiResponse<Product[]>> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.featured) searchParams.set("featured", "true");
    if (params?.search) searchParams.set("search", params.search);
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const response = await fetch(`/api/products?${searchParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function fetchProduct(id: string): Promise<ApiResponse<Product>> {
  try {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function fetchProductBySlug(
  slug: string
): Promise<ApiResponse<Product>> {
  try {
    const response = await fetch(`/api/products/slug/${slug}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Orders API
export async function fetchOrders(params?: {
  status?: string;
  paymentStatus?: string;
  limit?: number;
}): Promise<ApiResponse<Order[]>> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.paymentStatus)
      searchParams.set("paymentStatus", params.paymentStatus);
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const response = await fetch(`/api/orders?${searchParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function createOrder(
  orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'orderNumber' | 'paymentStatus' | 'paymentUrl' | 'customerId'>
): Promise<ApiResponse<Order>> {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Contacts API
export async function fetchContacts(params?: {
  status?: string;
  limit?: number;
}): Promise<ApiResponse<Contact[]>> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const response = await fetch(`/api/contacts?${searchParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function createContact(
  contactData: Pick<Contact, 'name' | 'email' | 'phone' | 'subject' | 'message'>
): Promise<ApiResponse<Contact>> {
  try {
    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error("Failed to create contact");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
