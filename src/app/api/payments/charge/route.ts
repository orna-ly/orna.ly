import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  compose,
  withErrorHandling,
  withMethods,
  withValidation,
  type ApiContext,
} from '@/lib/api-middleware';
import { apiError, apiSuccess } from '@/lib/api-response';

const chargeSchema = z.object({
  cardNumber: z.string().min(12).max(25),
  cardholderName: z.string().min(1),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/),
  expiryYear: z.string().regex(/^\d{4}$/),
  cvv: z.string().regex(/^\d{3,4}$/),
  amount: z.number().positive(),
  currency: z.string().length(3),
});

const luhnCheck = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 12) {
    return false;
  }
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(digits.charAt(i), 10);
    if (Number.isNaN(digit)) {
      return false;
    }
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

const chargeHandler = compose(
  withErrorHandling,
  withMethods(['POST']),
  withValidation(chargeSchema)
)(async (request: NextRequest, context: ApiContext) => {
  const data = context.validatedData as z.infer<typeof chargeSchema>;

  const sanitizedNumber = data.cardNumber.replace(/\s+/g, '');
  if (!luhnCheck(sanitizedNumber)) {
    return apiError('Invalid card number provided', 400);
  }

  const month = Number(data.expiryMonth);
  const year = Number(data.expiryYear);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (month < 1 || month > 12) {
    return apiError('Invalid expiration month', 400);
  }

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return apiError('Card has expired', 400);
  }

  if (data.amount <= 0) {
    return apiError('Payment amount must be positive', 400);
  }

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 300));

  const transactionId = `txn_${Date.now().toString(36)}`;

  return apiSuccess(
    {
      transactionId,
      status: 'succeeded' as const,
    },
    'Payment processed successfully',
    201
  );
});

export async function POST(request: NextRequest) {
  return chargeHandler(request, {});
}
