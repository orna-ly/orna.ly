import { describe, expect, it } from 'bun:test';
import {
  interpretPaymentResponse,
  type PaymentResponsePayload,
  validateCardDetails,
  type CardDetailsState,
} from '@/components/forms/order-form';

describe('validateCardDetails', () => {
  it('accepts well-formed card details', () => {
    const details: CardDetailsState = {
      cardholderName: 'Ada Lovelace',
      cardNumber: '4242 4242 4242 4242',
      expiry: '12/50',
      cvv: '123',
    };

    const result = validateCardDetails(details, 'en');
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.sanitizedNumber).toBe('4242424242424242');
    expect(result.expiryInfo).toMatchObject({
      month: '12',
      year: '2050',
      isValid: true,
    });
    expect(result.cvvDigits).toBe('123');
  });

  it('returns localized errors for invalid card inputs', () => {
    const details: CardDetailsState = {
      cardholderName: '',
      cardNumber: '1111 1111 1111 1111',
      expiry: '01/20',
      cvv: '1',
    };

    const result = validateCardDetails(details, 'ar');

    expect(result.isValid).toBe(false);
    expect(result.errors.cardholderName).toBe('اسم حامل البطاقة مطلوب');
    expect(result.errors.cardNumber).toBe('رقم البطاقة غير صالح');
    expect(result.errors.expiry).toBe('تاريخ الانتهاء غير صالح');
    expect(result.errors.cvv).toBe('رمز الأمان غير صالح');
  });
});

describe('interpretPaymentResponse', () => {
  it('returns the transaction identifier on success', () => {
    const payload: PaymentResponsePayload = {
      data: { transactionId: 'txn_123' },
      message: 'Payment processed successfully',
    };

    const outcome = interpretPaymentResponse(true, payload, 'en');
    expect(outcome).toEqual({ success: true, transactionId: 'txn_123' });
  });

  it('prefers gateway error strings over the fallback', () => {
    const payload: PaymentResponsePayload = {
      error: 'Gateway unavailable',
    };

    const outcome = interpretPaymentResponse(false, payload, 'en');
    expect(outcome.success).toBe(false);
    expect(outcome.errorMessage).toBe('Gateway unavailable');
  });

  it('uses translated fallback message when no error is provided', () => {
    const payload: PaymentResponsePayload = {};
    const outcome = interpretPaymentResponse(false, payload, 'ar');

    expect(outcome.success).toBe(false);
    expect(outcome.errorMessage).toBe(
      'تعذر معالجة الدفع. يرجى التحقق من بيانات البطاقة.'
    );
  });
});
