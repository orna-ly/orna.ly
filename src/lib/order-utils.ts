// Order utility functions

/**
 * Generates a SKU-style order number
 * Format: ORN-YYYY-NNNNNN (e.g., ORN-2024-000001)
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now();
  // Use last 6 digits of timestamp for uniqueness
  const orderSequence = String(timestamp).slice(-6).padStart(6, "0");
  return `ORN-${year}-${orderSequence}`;
}

/**
 * Validates if a string is a valid order number format
 */
export function isValidOrderNumber(orderNumber: string): boolean {
  const orderNumberRegex = /^ORN-\d{4}-\d{6}$/;
  return orderNumberRegex.test(orderNumber);
}
