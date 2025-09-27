import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { generateOrderNumber } from '@/lib/order-utils';
import { OrderStatus, PaymentStatus } from '@prisma/client';

interface ImportOrderData {
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: string;
  state: string;
  totalAmount: number;
  wrappingCost?: number;
  needsWrapping?: boolean;
  paymentMethod?: string;
  notes?: string;
  status?: string;
  paymentStatus?: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ordersData: ImportOrderData[] = await request.json();

    if (!Array.isArray(ordersData) || ordersData.length === 0) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Process each order
    const createdOrders = [];
    for (const orderData of ordersData) {
      try {
        const order = await prisma.order.create({
          data: {
            orderNumber: orderData.orderNumber || generateOrderNumber(),
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            customerEmail: orderData.customerEmail || null,
            shippingAddress: {
              address: orderData.address,
              city: orderData.city,
              state: orderData.state,
            },
            totalAmount: orderData.totalAmount,
            wrappingCost: orderData.wrappingCost || null,
            needsWrapping: orderData.needsWrapping || false,
            paymentMethod: orderData.paymentMethod || null,
            notes: orderData.notes || null,
            status:
              orderData.status &&
              Object.values(OrderStatus).includes(
                orderData.status as OrderStatus
              )
                ? (orderData.status as OrderStatus)
                : OrderStatus.PENDING,
            paymentStatus:
              orderData.paymentStatus &&
              Object.values(PaymentStatus).includes(
                orderData.paymentStatus as PaymentStatus
              )
                ? (orderData.paymentStatus as PaymentStatus)
                : PaymentStatus.PENDING,
          },
        });
        createdOrders.push(order);
      } catch (error) {
        console.error('Error creating order:', error);
        // Continue with other orders even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      created: createdOrders.length,
      total: ordersData.length,
    });
  } catch (error) {
    console.error('Batch order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create orders' },
      { status: 500 }
    );
  }
}
