import { NextRequest } from 'next/server';
import { describe, expect, it, mock } from 'bun:test';
import type { Product } from '@/lib/types';
import { createOrderHandler } from '@/app/api/orders/route';

function buildRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/orders', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  });
}

function buildProduct(overrides: Partial<Product> = {}): Product {
  const now = new Date();
  return {
    id: 'prod_1',
    name: { en: 'Pearl Necklace' },
    slug: 'pearl-necklace',
    price: 150,
    images: ['necklace.jpg'],
    description: { en: 'Elegant necklace' },
    featured: false,
    category: 'NATURAL_PEARLS',
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as Product;
}

describe('POST /api/orders', () => {
  it('creates an order, decrements inventory, and returns the order payload', async () => {
    const product = buildProduct({ stockQuantity: 3, wrappingPrice: 25 });
    const createdOrder = {
      id: 'order_1',
      orderNumber: 'ORDER-12345',
      items: [],
    };

    const productFindMany = mock(async () => [product]);
    const orderCreate = mock(async () => createdOrder);
    const productUpdate = mock(async () => ({}));
    const transaction = mock(
      async (callback: (tx: Record<string, unknown>) => Promise<unknown>) =>
        callback({
          order: { create: orderCreate },
          product: { update: productUpdate },
        })
    );

    const handler = createOrderHandler({
      product: { findMany: productFindMany },
      $transaction: transaction,
    } as never);

    const response = await handler(
      buildRequest({
        customerName: 'Grace Hopper',
        customerPhone: '+123456789',
        customerEmail: 'grace@example.com',
        shippingAddress: {
          address: '123 Main St',
          city: 'Tripoli',
          state: 'Tripoli',
        },
        totalAmount: 350,
        wrappingCost: 25,
        needsWrapping: true,
        paymentMethod: 'card',
        paymentStatus: 'PAID',
        paymentReference: 'txn_123',
        items: [
          {
            productId: product.id,
            quantity: 2,
            unitPrice: product.price,
            totalPrice: product.price * 2,
          },
        ],
      }),
      {}
    );

    expect(response.status).toBe(201);
    expect(productFindMany.mock.calls.length).toBe(1);
    expect(transaction.mock.calls.length).toBe(1);
    expect(orderCreate.mock.calls[0][0]).toMatchObject({
      data: expect.objectContaining({
        paymentStatus: 'PAID',
        paymentReference: 'txn_123',
      }),
    });
    expect(productUpdate.mock.calls[0][0]).toMatchObject({
      where: { id: product.id },
      data: expect.objectContaining({ stockQuantity: 1, status: 'ACTIVE' }),
    });

    const body = (await response.json()) as { data?: Record<string, unknown> };
    expect(body.data).toMatchObject({
      id: 'order_1',
      orderNumber: 'ORDER-12345',
    });
  });

  it('fails when any product is missing or inactive', async () => {
    const productFindMany = mock(async () => [] as Product[]);
    const transaction = mock(async () => {
      throw new Error('transaction should not run');
    });

    const handler = createOrderHandler({
      product: { findMany: productFindMany },
      $transaction: transaction,
    } as never);

    const response = await handler(
      buildRequest({
        customerName: 'Missing Product',
        customerPhone: '+123456789',
        shippingAddress: {
          address: '123 Main St',
          city: 'Tripoli',
        },
        totalAmount: 100,
        needsWrapping: false,
        items: [
          {
            productId: 'prod_missing',
            quantity: 1,
            unitPrice: 100,
            totalPrice: 100,
          },
        ],
      }),
      {}
    );

    expect(response.status).toBe(400);
    expect(transaction.mock.calls.length).toBe(0);
    const body = (await response.json()) as Record<string, unknown>;
    expect(body).toMatchObject({
      message: 'One or more products are not available',
    });
  });

  it('fails when cart quantity exceeds stock levels', async () => {
    const product = buildProduct({ stockQuantity: 1 });
    const productFindMany = mock(async () => [product]);
    const transaction = mock(async () => {
      throw new Error('transaction should not run');
    });

    const handler = createOrderHandler({
      product: { findMany: productFindMany },
      $transaction: transaction,
    } as never);

    const response = await handler(
      buildRequest({
        customerName: 'Stock Tester',
        customerPhone: '+123456789',
        shippingAddress: {
          address: '123 Main St',
          city: 'Tripoli',
        },
        totalAmount: 100,
        needsWrapping: false,
        items: [
          {
            productId: product.id,
            quantity: 2,
            unitPrice: product.price,
            totalPrice: product.price * 2,
          },
        ],
      }),
      {}
    );

    expect(response.status).toBe(400);
    expect(transaction.mock.calls.length).toBe(0);
    const body = (await response.json()) as Record<string, unknown>;
    expect(body).toMatchObject({
      message: 'One or more products do not have enough stock',
    });
  });

  it('asks clients to refresh if product prices changed', async () => {
    const product = buildProduct({ price: 100, stockQuantity: 10 });
    const productFindMany = mock(async () => [product]);
    const transaction = mock(async () => {
      throw new Error('transaction should not run');
    });

    const handler = createOrderHandler({
      product: { findMany: productFindMany },
      $transaction: transaction,
    } as never);

    const response = await handler(
      buildRequest({
        customerName: 'Price Watcher',
        customerPhone: '+123456789',
        shippingAddress: {
          address: '123 Main St',
          city: 'Tripoli',
        },
        totalAmount: 200,
        needsWrapping: false,
        items: [
          {
            productId: product.id,
            quantity: 1,
            unitPrice: 120,
            totalPrice: 120,
          },
        ],
      }),
      {}
    );

    expect(response.status).toBe(400);
    expect(transaction.mock.calls.length).toBe(0);
    const body = (await response.json()) as Record<string, unknown>;
    expect(body).toMatchObject({
      message: 'Product prices have changed. Please refresh and try again.',
    });
  });
});
