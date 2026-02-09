import * as crypto from 'crypto';

/**
 * Generate HMACSHA512 hash for EPS API authentication
 *
 * Mechanism for Hash (as per EPS documentation):
 * Step 1: Encode Hash Key using UTF8
 * Step 2: Create HMACSHA512 using encoded data
 * Step 3: Compute Hash using created hmac and value (username, transactionId, etc.)
 * Step 4: Return Base64 string of Hash
 *
 * @param value - The value to hash (username, transactionId, etc.)
 * @param hashKey - The hash key provided by EPS
 * @returns Base64 encoded HMACSHA512 hash
 */
export function generateHash(value: string, hashKey: string): string {
  try {
    // Step 1 & 2: Encode hash key and create HMAC
    const hmac = crypto.createHmac('sha512', Buffer.from(hashKey, 'utf8'));

    // Step 3: Compute hash
    hmac.update(value, 'utf8');

    // Step 4: Return Base64 string
    return hmac.digest('base64');
  } catch (error) {
    throw new Error(`Hash generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate hash key format
 * @param hashKey - The hash key to validate
 * @returns true if valid
 */
export function validateHashKey(hashKey: string): boolean {
  if (!hashKey || typeof hashKey !== 'string') {
    return false;
  }

  // Hash key should be a base64 string
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  return base64Regex.test(hashKey) && hashKey.length > 20;
}

/**
 * Generate unique merchant transaction ID
 * Format: YYYYMMDDHHmmssSSS (timestamp-based)
 * @returns Unique transaction ID (17 digits)
 */
export function generateTransactionId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
}
