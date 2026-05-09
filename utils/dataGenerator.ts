/**
 * Utility functions for generating random test data at runtime.
 * Keeps test data dynamic — no hardcoded values in test files.
 */

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Generates a random alphabetic string of the given length.
 */
export function randomString(length = 8): string {
  return Array.from({ length }, () =>
    ALPHA[Math.floor(Math.random() * ALPHA.length)]
  ).join('');
}

/**
 * Generates a random integer string of the given digit count.
 * Useful for postal codes — guarantees no leading zero issues.
 */
export function randomPostalCode(digits = 5): string {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

/**
 * Generates a complete set of random checkout form data.
 */
export function generateCheckoutData(): {
  firstName: string;
  lastName: string;
  postalCode: string;
} {
  return {
    firstName: randomString(6),
    lastName: randomString(8),
    postalCode: randomPostalCode(5),
  };
}
