import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { generateOrderNumber } from '@/lib/order-utils';
import {
  withValidation,
  withAdminAuth,
  withErrorHandling,
  withMethods,
  compose,
  type ApiContext,
} from '@/lib/api-middleware';
import {
  orderFiltersSchema,
  createOrderSchema,
  type OrderFiltersInput,
  type CreateOrderInput,
} from '@/lib/validations';
import {
  apiSuccess,
  handleDatabaseError,
  calculatePagination,
} from '@/lib/api-response';

// GET /api/orders - Fetch orders with filters
const getOrders = compose(
  withErrorHandling,
  withMethods(['GET']),
  withAdminAuth,
  withValidation(orderFiltersSchema)
)(async (request: NextRequest, context: ApiContext) => {
  const filters = context.validatedData as OrderFiltersInput;

  const where: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    customerName?: { contains: string; mode: 'insensitive' };
  } = {};

  // Apply status filter
  if (filters.status) {
    where.status = filters.status;
  }

  // Apply payment status filter
  if (filters.paymentStatus) {
    where.paymentStatus = filters.paymentStatus;
  }

  // Apply customer name search
  if (filters.customerName) {
    where.customerName = {
      contains: filters.customerName,
      mode: 'insensitive',
    };
  }

  try {
    // Get total count for pagination
    const total = await prisma.order.count({ where });

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit;

    // Fetch orders with related data
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: filters.limit,
    });

    const pagination = calculatePagination(filters.page, filters.limit, total);

    return apiSuccess(orders, 'Orders fetched successfully', 200, pagination);
  } catch (error) {
    return handleDatabaseError(error);
  }
});

// POST /api/orders - Create a new order
export function createOrderHandler(prismaClient: typeof prisma = prisma) {
  return compose(
    withErrorHandling,
    withMethods(['POST']),
    withValidation(createOrderSchema)
  )(async (request: NextRequest, context: ApiContext) => {
    const orderData = context.validatedData as CreateOrderInput;

    try {
      // Verify that all products exist and are available
      const productIds = orderData.items.map((item) => item.productId);
      const products = await prismaClient.product.findMany({
        where: {
          id: { in: productIds },
          status: 'ACTIVE',
        },
      });

      if (products.length !== productIds.length) {
        return apiSuccess(null, 'One or more products are not available', 400);
      }

      const insufficientStock = orderData.items.filter((item) => {
        const product = products.find((p) => p.id === item.productId);
        return (
          product !== undefined &&
          typeof product.stockQuantity === 'number' &&
          product.stockQuantity < item.quantity
        );
      });

      if (insufficientStock.length > 0) {
        return apiSuccess(
          null,
          'One or more products do not have enough stock',
          400
        );
      }

      // Validate item prices against current product prices
      const priceValidationErrors: string[] = [];
      for (const item of orderData.items) {
        const product = products.find((p) => p.id === item.productId);
        if (product && product.price !== item.unitPrice) {
          const productName =
            typeof product.name === 'object' && product.name
              ? (product.name as Record<string, string>).en ||
                (product.name as Record<string, string>).ar ||
                'Unknown Product'
              : 'Unknown Product';
          priceValidationErrors.push(
            `Price mismatch for product ${productName}: expected ${product.price}, got ${item.unitPrice}`
          );
        }
      }

      if (priceValidationErrors.length > 0) {
        return apiSuccess(
          null,
          'Product prices have changed. Please refresh and try again.',
          400
        );
      }

      // Create the order with items
      const order = await prismaClient.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            customerEmail: orderData.customerEmail,
            shippingAddress: orderData.shippingAddress,
            totalAmount: orderData.totalAmount,
            wrappingCost: orderData.wrappingCost,
            needsWrapping: orderData.needsWrapping,
            paymentMethod: orderData.paymentMethod,
            paymentStatus: orderData.paymentStatus,
            paymentReference: orderData.paymentReference,
            notes: orderData.notes,
            items: {
              create: orderData.items,
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        await Promise.all(
          orderData.items.map(async (item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
              return;
            }

            const nextQuantity = Math.max(
              0,
              (product.stockQuantity ?? 0) - item.quantity
            );

            await tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: nextQuantity,
                status:
                  nextQuantity === 0
                    ? 'OUT_OF_STOCK'
                    : product.status === 'INACTIVE'
                      ? 'INACTIVE'
                      : 'ACTIVE',
              },
            });
          })
        );

        return createdOrder;
      });

      return apiSuccess(order, 'Order created successfully', 201);
    } catch (error) {
      return handleDatabaseError(error);
    }
  });
}

const createOrder = createOrderHandler();

export async function GET(request: NextRequest) {
  return getOrders(request, {});
}

export async function POST(request: NextRequest) {
  return createOrder(request, {});
}
