import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ApiSuccessResponse<T = unknown> {
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  error: string;
  details?: ApiError[];
}

// Success response helper
export function apiSuccess<T>(
  data: T,
  message?: string,
  status: number = 200,
  pagination?: ApiSuccessResponse<T>['pagination']
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      data,
      message,
      pagination,
    },
    { status }
  );
}

// Error response helper
export function apiError(
  message: string,
  status: number = 400,
  details?: ApiError[]
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      details,
    },
    { status }
  );
}

// Validation error handler
export function handleValidationError(
  error: ZodError
): NextResponse<ApiErrorResponse> {
  const details: ApiError[] = error.issues.map((issue) => ({
    message: issue.message,
    field: issue.path.join('.'),
    code: issue.code,
  }));

  return apiError('Validation failed', 400, details);
}

// Generic error handler
// TODO: Improve typing - error should be a union of expected error types
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return handleValidationError(error);
  }

  if (error instanceof Error) {
    return apiError(error.message, 500);
  }

  return apiError('An unexpected error occurred', 500);
}

// Database error handler
// TODO: Improve typing - error should be typed as PrismaClientKnownRequestError | Error
export function handleDatabaseError(
  error: unknown
): NextResponse<ApiErrorResponse> {
  console.error('Database Error:', error);

  // Handle Prisma specific errors
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const prismaError = error as { code: string; message: string };

    switch (prismaError.code) {
      case 'P2002':
        return apiError('A record with this data already exists', 409);
      case 'P2025':
        return apiError('Record not found', 404);
      case 'P2003':
        return apiError('Foreign key constraint failed', 400);
      default:
        return apiError('Database operation failed', 500);
    }
  }

  return apiError('Database error occurred', 500);
}

// Authentication error helpers
export function unauthorizedError(
  message: string = 'Authentication required'
): NextResponse<ApiErrorResponse> {
  return apiError(message, 401);
}

export function forbiddenError(
  message: string = 'Insufficient permissions'
): NextResponse<ApiErrorResponse> {
  return apiError(message, 403);
}

export function notFoundError(
  message: string = 'Resource not found'
): NextResponse<ApiErrorResponse> {
  return apiError(message, 404);
}

// Rate limiting error
export function rateLimitError(
  message: string = 'Too many requests'
): NextResponse<ApiErrorResponse> {
  return apiError(message, 429);
}

// Pagination helper
export function calculatePagination(
  page: number,
  limit: number,
  total: number
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
