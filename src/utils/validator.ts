import { EPSConfig, InitializePaymentParams } from '../types';
import { EPSError } from '../types';

/**
 * Validate EPS configuration
 * @param config - EPS configuration object
 * @throws EPSError if validation fails
 */
export function validateConfig(config: EPSConfig): void {
  const required = ['username', 'password', 'hashKey', 'merchantId', 'storeId'];

  for (const field of required) {
    if (!config[field as keyof EPSConfig]) {
      throw new EPSError(`Missing required configuration: ${field}`, 'INVALID_CONFIG');
    }
  }

  // Validate username format (usually email)
  if (config.username && !isValidEmail(config.username)) {
    throw new EPSError('Invalid username format (expected email)', 'INVALID_CONFIG');
  }

  // Validate merchant ID and store ID (should be UUIDs)
  if (config.merchantId && !isValidUUID(config.merchantId)) {
    throw new EPSError('Invalid merchantId format (expected UUID)', 'INVALID_CONFIG');
  }

  if (config.storeId && !isValidUUID(config.storeId)) {
    throw new EPSError('Invalid storeId format (expected UUID)', 'INVALID_CONFIG');
  }
}

/**
 * Validate payment initialization parameters
 * @param params - Payment parameters
 * @throws EPSError if validation fails
 */
export function validatePaymentParams(params: InitializePaymentParams): void {
  // Required fields
  const required = [
    'customerOrderId',
    'merchantTransactionId',
    'totalAmount',
    'successUrl',
    'failUrl',
    'cancelUrl',
    'customerName',
    'customerEmail',
    'customerAddress',
    'customerCity',
    'customerState',
    'customerPostcode',
    'customerPhone',
    'productName',
  ];

  for (const field of required) {
    if (!params[field as keyof InitializePaymentParams]) {
      throw new EPSError(`Missing required parameter: ${field}`, 'INVALID_PARAMS');
    }
  }

  // Validate transaction ID (minimum 10 digits)
  if (params.merchantTransactionId.length < 10) {
    throw new EPSError(
      'merchantTransactionId must be at least 10 digits',
      'INVALID_TRANSACTION_ID'
    );
  }

  // Validate amount
  if (params.totalAmount <= 0) {
    throw new EPSError('totalAmount must be greater than 0', 'INVALID_AMOUNT');
  }

  // Validate email
  if (!isValidEmail(params.customerEmail)) {
    throw new EPSError('Invalid customer email format', 'INVALID_EMAIL');
  }

  // Validate phone (Bangladesh format)
  if (!isValidBDPhone(params.customerPhone)) {
    throw new EPSError(
      'Invalid phone number format (expected Bangladesh format: 01XXXXXXXXX)',
      'INVALID_PHONE'
    );
  }

  // Validate URLs
  const urls = ['successUrl', 'failUrl', 'cancelUrl'];
  for (const urlField of urls) {
    const url = params[urlField as keyof InitializePaymentParams] as string;
    if (!isValidURL(url)) {
      throw new EPSError(`Invalid ${urlField} format`, 'INVALID_URL');
    }
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate UUID format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate Bangladesh phone number
 * Format: 01XXXXXXXXX (11 digits starting with 01)
 */
function isValidBDPhone(phone: string): boolean {
  const bdPhoneRegex = /^01[0-9]{9}$/;
  return bdPhoneRegex.test(phone.replace(/[^0-9]/g, ''));
}

/**
 * Validate URL format
 */
function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
