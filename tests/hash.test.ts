import { generateHash, generateTransactionId, validateHashKey } from '../src/utils/hash';

describe('Hash Utility', () => {
  describe('generateHash', () => {
    it('should generate HMACSHA512 hash in base64 format', () => {
      const value = 'test_username';
      const hashKey = 'SFNLQHJlY2lwZXdhbGEjYTc3Zi1mOTQ5NWZhY2M2ZTZuZXQ=';

      const hash = generateHash(value, hashKey);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(50);
      // Base64 format check
      expect(hash).toMatch(/^[A-Za-z0-9+/]+=*$/);
    });

    it('should generate consistent hash for same input', () => {
      const value = 'test_value';
      const hashKey = 'test_key';

      const hash1 = generateHash(value, hashKey);
      const hash2 = generateHash(value, hashKey);

      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different values', () => {
      const hashKey = 'test_key';

      const hash1 = generateHash('value1', hashKey);
      const hash2 = generateHash('value2', hashKey);

      expect(hash1).not.toBe(hash2);
    });

    it('should throw error for invalid input', () => {
      expect(() => generateHash('', '')).toThrow();
    });
  });

  describe('validateHashKey', () => {
    it('should validate correct hash key', () => {
      const validKey = 'SFNLQHJlY2lwZXdhbGEjYTc3Zi1mOTQ5NWZhY2M2ZTZuZXQ=';
      expect(validateHashKey(validKey)).toBe(true);
    });

    it('should reject empty hash key', () => {
      expect(validateHashKey('')).toBe(false);
    });

    it('should reject short hash key', () => {
      expect(validateHashKey('short')).toBe(false);
    });

    it('should reject non-base64 hash key', () => {
      expect(validateHashKey('this-is-not-base64!@#$%')).toBe(false);
    });
  });

  describe('generateTransactionId', () => {
    it('should generate transaction ID in correct format', () => {
      const txnId = generateTransactionId();

      expect(txnId).toBeDefined();
      expect(typeof txnId).toBe('string');
      expect(txnId.length).toBe(17); // YYYYMMDDHHmmssSSS
      expect(txnId).toMatch(/^\d{17}$/); // All digits
    });

    it('should generate unique transaction IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 10; i++) {
        ids.add(generateTransactionId());
      }
      expect(ids.size).toBe(10); // All unique
    });

    it('should start with current year', () => {
      const txnId = generateTransactionId();
      const currentYear = new Date().getFullYear().toString();
      expect(txnId.startsWith(currentYear)).toBe(true);
    });
  });
});
