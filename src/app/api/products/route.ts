import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductStatus } from '@prisma/client';
import {
  withValidation,
  withAdminAuth,
  withErrorHandling,
  withMethods,
  compose,
  type ApiContext,
} from '@/lib/api-middleware';
import {
  productFiltersSchema,
  createProductSchema,
  type ProductFiltersInput,
  type CreateProductInput,
} from '@/lib/validations';
import {
  apiSuccess,
  handleDatabaseError,
  calculatePagination,
} from '@/lib/api-response';

// GET /api/products - Fetch products with filters
const getProducts = compose(
  withErrorHandling,
  withMethods(['GET']),
  withValidation(productFiltersSchema)
)(async (request: NextRequest, context: ApiContext) => {
  const filters = context.validatedData as ProductFiltersInput;

  const where: {
    status?: ProductStatus;
    featured?: boolean;
    price?: { gte?: number; lte?: number };
    OR?: Array<{
      name?: { path: string[]; string_contains: string };
      description?: { path: string[]; string_contains: string };
    }>;
  } = {};

  // Apply status filter (default to ACTIVE if not specified)
  where.status = filters.status || ProductStatus.ACTIVE;

  // Apply featured filter
  if (filters.featured !== undefined) {
    where.featured = filters.featured;
  }

  // Apply price range filters
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  // Apply search filter
  if (filters.search) {
    where.OR = [
      {
        name: {
          path: ['ar'],
          string_contains: filters.search,
        },
      },
      {
        name: {
          path: ['en'],
          string_contains: filters.search,
        },
      },
      {
        description: {
          path: ['ar'],
          string_contains: filters.search,
        },
      },
      {
        description: {
          path: ['en'],
          string_contains: filters.search,
        },
      },
    ];
  }

  try {
    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit;

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: filters.limit,
    });

    const pagination = calculatePagination(filters.page, filters.limit, total);

    return apiSuccess(
      products,
      'Products fetched successfully',
      200,
      pagination
    );
  } catch (error) {
    return handleDatabaseError(error);
  }
});

// POST /api/products - Create a new product
const createProduct = compose(
  withErrorHandling,
  withMethods(['POST']),
  withAdminAuth,
  withValidation(createProductSchema)
)(async (request: NextRequest, context: ApiContext) => {
  const productData = context.validatedData as CreateProductInput;

  try {
    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: productData.slug },
    });

    if (existingProduct) {
      return apiSuccess(null, 'Product with this slug already exists', 409);
    }

    const product = await prisma.product.create({
      data: productData,
    });

    return apiSuccess(product, 'Product created successfully', 201);
  } catch (error) {
    return handleDatabaseError(error);
  }
});

export async function GET(request: NextRequest) {
  return getProducts(request, {});
}

export async function POST(request: NextRequest) {
  return createProduct(request, {});
}
