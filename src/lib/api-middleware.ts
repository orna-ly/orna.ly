import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin, verifyToken, type AuthUser } from './admin-auth';
import {
  handleValidationError,
  unauthorizedError,
  forbiddenError,
} from './api-response';

// Middleware function type
export type ApiHandler = (
  request: NextRequest,
  context: ApiContext
) => Promise<Response> | Response;

// API Context interface
export interface ApiContext {
  params?: Record<string, string>;
  user?: AuthUser | null;
  // TODO: Improve typing - should be generic based on the validation schema used
  validatedData?: unknown;
}

// Validation middleware
export function withValidation<T extends z.ZodSchema>(schema: T) {
  return function (handler: ApiHandler) {
    return async function (request: NextRequest, context: ApiContext = {}) {
      try {
        // TODO: Improve typing - data should be typed based on request method and schema
        let data: unknown;

        if (request.method === 'GET') {
          // Validate query parameters
          const url = new URL(request.url);
          const queryParams: Record<string, unknown> = {};

          for (const [key, value] of url.searchParams.entries()) {
            // Try to parse numbers and booleans
            if (value === 'true' || value === 'false') {
              queryParams[key] = value === 'true';
            } else if (!isNaN(Number(value)) && value !== '') {
              queryParams[key] = Number(value);
            } else {
              queryParams[key] = value;
            }
          }

          data = queryParams;
        } else {
          // Validate request body
          const body = await request.json();
          data = body;
        }

        const validatedData = schema.parse(data);
        context.validatedData = validatedData;

        return handler(request, context);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return handleValidationError(error);
        }
        throw error;
      }
    };
  };
}

// Authentication middleware
export function withAuth(handler: ApiHandler) {
  return async function (request: NextRequest, context: ApiContext = {}) {
    const token = request.cookies.get('orna_admin_token')?.value;

    if (!token) {
      return unauthorizedError('Authentication token required');
    }

    const user = verifyToken(token);
    if (!user) {
      return unauthorizedError('Invalid or expired token');
    }

    context.user = user;
    return handler(request, context);
  };
}

// Admin authorization middleware
export function withAdminAuth(handler: ApiHandler) {
  return withAuth(async function (request: NextRequest, context: ApiContext) {
    if (!context.user) {
      return unauthorizedError();
    }

    const adminUser = requireAdmin(request);
    if (!adminUser) {
      return forbiddenError('Admin access required');
    }

    context.user = adminUser;
    return handler(request, context);
  });
}

// CORS middleware
export function withCors(handler: ApiHandler) {
  return async function (request: NextRequest, context: ApiContext = {}) {
    const response = await handler(request, context);

    // Add CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

// Rate limiting middleware (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000
) {
  return function (handler: ApiHandler) {
    return async function (request: NextRequest, context: ApiContext = {}) {
      const ip =
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';
      const now = Date.now();
      const windowStart = now - windowMs;

      // Clean up old entries
      for (const [key, value] of rateLimitMap.entries()) {
        if (value.resetTime < windowStart) {
          rateLimitMap.delete(key);
        }
      }

      const current = rateLimitMap.get(ip) || {
        count: 0,
        resetTime: now + windowMs,
      };

      if (current.count >= maxRequests && current.resetTime > now) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(
              (current.resetTime - now) / 1000
            ).toString(),
          },
        });
      }

      // Update rate limit
      if (current.resetTime <= now) {
        current.count = 1;
        current.resetTime = now + windowMs;
      } else {
        current.count += 1;
      }

      rateLimitMap.set(ip, current);

      return handler(request, context);
    };
  };
}

// Compose multiple middleware functions
export function compose(
  ...middlewares: Array<(handler: ApiHandler) => ApiHandler>
) {
  return function (handler: ApiHandler): ApiHandler {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      handler
    );
  };
}

// Method guard middleware
export function withMethods(allowedMethods: string[]) {
  return function (handler: ApiHandler) {
    return async function (request: NextRequest, context: ApiContext = {}) {
      if (!allowedMethods.includes(request.method)) {
        return new Response(
          JSON.stringify({ error: `Method ${request.method} not allowed` }),
          {
            status: 405,
            headers: {
              'Content-Type': 'application/json',
              Allow: allowedMethods.join(', '),
            },
          }
        );
      }

      return handler(request, context);
    };
  };
}

// Error handling middleware
export function withErrorHandling(handler: ApiHandler) {
  return async function (request: NextRequest, context: ApiContext = {}) {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);

      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}
