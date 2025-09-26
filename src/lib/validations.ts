import { z } from 'zod';

// Product validation schemas
export const createProductSchema = z.object({
  name: z.object({
    ar: z.string().min(1, 'Arabic name is required'),
    en: z.string().min(1, 'English name is required'),
  }),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  price: z.number().min(0, 'Price must be positive'),
  priceBeforeDiscount: z.number().min(0).optional(),
  wrappingPrice: z.number().min(0).optional(),
  stockQuantity: z
    .number()
    .int()
    .min(0, 'Stock quantity must be a non-negative integer')
    .default(0),
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required'),
  featured: z.boolean().default(false),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).default('ACTIVE'),
  subtitle: z
    .object({
      ar: z.string().optional(),
      en: z.string().optional(),
    })
    .optional(),
  description: z.object({
    ar: z.string().min(1, 'Arabic description is required'),
    en: z.string().min(1, 'English description is required'),
  }),
});

export const updateProductSchema = createProductSchema.partial();

// Order validation schemas
export const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().min(1, 'Customer phone is required'),
  customerEmail: z.string().email('Invalid email').optional(),
  shippingAddress: z.object({
    address: z.string().min(1, 'Shipping address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
  }),
  totalAmount: z.number().min(0, 'Total amount must be positive'),
  wrappingCost: z.number().min(0).optional(),
  needsWrapping: z.boolean().default(false),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        unitPrice: z.number().min(0, 'Unit price must be positive'),
        totalPrice: z.number().min(0, 'Total price must be positive'),
      })
    )
    .min(1, 'At least one item is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
  notes: z.string().optional(),
});

// Contact validation schemas
export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

export const updateContactStatusSchema = z.object({
  status: z.enum(['NEW', 'REPLIED', 'RESOLVED']),
});

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(1, 'Name is required'),
});

// Settings validation schemas
export const updateSettingSchema = z.object({
  key: z.string().min(1, 'Setting key is required'),
  value: z.unknown(),
});

// Query parameter validation schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export const productFiltersSchema = z
  .object({
    featured: z.boolean().optional(),
    search: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
  })
  .merge(paginationSchema);

export const orderFiltersSchema = z
  .object({
    status: z
      .enum([
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ])
      .optional(),
    paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
    customerName: z.string().optional(),
  })
  .merge(paginationSchema);

export const contactFiltersSchema = z
  .object({
    status: z.enum(['NEW', 'REPLIED', 'RESOLVED']).optional(),
  })
  .merge(paginationSchema);

// Type exports
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactStatusInput = z.infer<
  typeof updateContactStatusSchema
>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
export type OrderFiltersInput = z.infer<typeof orderFiltersSchema>;
export type ContactFiltersInput = z.infer<typeof contactFiltersSchema>;
