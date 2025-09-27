import { NextRequest } from 'next/server';
import { describe, expect, it } from 'bun:test';
import { POST } from '@/app/api/payments/charge/route';

function buildRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/payments/charge', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  });
}

describe('POST /api/payments/charge', () => {
  it('approves a valid card charge request', async () => {
    const response = await POST(
      buildRequest({
        cardNumber: '4242 4242 4242 4242',
        cardholderName: 'Ada Lovelace',
        expiryMonth: '12',
        expiryYear: String(new Date().getFullYear() + 2),
        cvv: '123',
        amount: 199.99,
        currency: 'LYD',
      })
    );

    expect(response.status).toBe(201);
    const payload = (await response.json()) as Record<string, unknown>;

    expect(payload).toMatchObject({
      message: 'Payment processed successfully',
      data: {
        status: 'succeeded',
      },
    });

    expect(typeof (payload.data as Record<string, unknown>).transactionId).toBe(
      'string'
    );
  });

  it('rejects non-Luhn card numbers', async () => {
    const response = await POST(
      buildRequest({
        cardNumber: '1234 1234 1234 1234',
        cardholderName: 'Invalid User',
        expiryMonth: '12',
        expiryYear: String(new Date().getFullYear() + 1),
        cvv: '123',
        amount: 10,
        currency: 'LYD',
      })
    );

    expect(response.status).toBe(400);
    const payload = (await response.json()) as Record<string, unknown>;
    expect(payload).toMatchObject({
      error: 'Invalid card number provided',
    });
  });

  it('fails when the card is expired', async () => {
    const now = new Date();
    const response = await POST(
      buildRequest({
        cardNumber: '4242 4242 4242 4242',
        cardholderName: 'Expired User',
        expiryMonth: '01',
        expiryYear: String(now.getFullYear() - 1),
        cvv: '123',
        amount: 25,
        currency: 'LYD',
      })
    );

    expect(response.status).toBe(400);
    const payload = (await response.json()) as Record<string, unknown>;
    expect(payload).toMatchObject({
      error: 'Card has expired',
    });
  });
});
