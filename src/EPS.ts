import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  EPSConfig,
  EPSError,
  InitializePaymentParams,
  InitializePaymentResponse,
  TokenResponse,
  TransactionType,
  VerifyPaymentParams,
  VerifyPaymentResponse,
} from './types';
import { generateHash } from './utils/hash';
import { validateConfig, validatePaymentParams } from './utils/validator';

/**
 * EPS Payment Gateway SDK
 *
 * Unofficial Node.js SDK for EPS (Easy Payment System) Payment Gateway - Bangladesh
 *
 * @example
 * ```typescript
 * const eps = new EPS({
 *   username: 'your_username',
 *   password: 'your_password',
 *   hashKey: 'your_hash_key',
 *   merchantId: 'your_merchant_id',
 *   storeId: 'your_store_id',
 *   sandbox: true
 * });
 *
 * const payment = await eps.initializePayment({
 *   customerOrderId: 'ORD123',
 *   merchantTransactionId: '20240117001',
 *   totalAmount: 1000,
 *   customerName: 'John Doe',
 *   // ... other required fields
 * });
 * ```
 */
export class EPS {
  private config: Required<EPSConfig>;
  private httpClient: AxiosInstance;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  /**
   * API endpoints
   */
  private readonly ENDPOINTS = {
    SANDBOX: {
      GET_TOKEN: 'https://sandbox-pgapi.eps.com.bd/v1/Auth/GetToken',
      INITIALIZE: 'https://sandbox-pgapi.eps.com.bd/v1/EPSEngine/InitializeEPS',
      VERIFY: 'https://sandbox-pgapi.eps.com.bd/v1/EPSEngine/CheckMerchantTransactionStatus',
    },
    PRODUCTION: {
      GET_TOKEN: 'https://pgapi.eps.com.bd/v1/Auth/GetToken',
      INITIALIZE: 'https://pgapi.eps.com.bd/v1/EPSEngine/InitializeEPS',
      VERIFY: 'https://pgapi.eps.com.bd/v1/EPSEngine/CheckMerchantTransactionStatus',
    },
  };

  /**
   * Create EPS instance
   * @param config - EPS configuration
   */
  constructor(config: EPSConfig) {
    // Validate configuration
    validateConfig(config);

    // Set defaults
    this.config = {
      ...config,
      sandbox: config.sandbox ?? false,
      timeout: config.timeout ?? 30000,
    };

    // Create HTTP client
    this.httpClient = axios.create({
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.httpClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        throw this.handleError(error);
      }
    );
  }

  /**
   * Get API endpoints based on environment
   */
  private getEndpoints() {
    return this.config.sandbox ? this.ENDPOINTS.SANDBOX : this.ENDPOINTS.PRODUCTION;
  }

  /**
   * Get authentication token
   * Caches token until expiry
   * @returns JWT token
   */
  private async getToken(): Promise<string> {
    // Return cached token if still valid
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.token;
    }

    try {
      // Generate hash using username
      const hash = generateHash(this.config.username, this.config.hashKey);

      const response = await this.httpClient.post<TokenResponse>(
        this.getEndpoints().GET_TOKEN,
        {
          userName: this.config.username,
          password: this.config.password,
        },
        {
          headers: {
            'x-hash': hash,
          },
        }
      );

      const data = response.data;

      if (data.errorMessage || data.errorCode) {
        throw new EPSError(
          data.errorMessage || 'Failed to get token',
          data.errorCode || 'TOKEN_ERROR',
          data
        );
      }

      // Cache token
      this.token = data.token;
      this.tokenExpiry = new Date(data.expireDate);

      return data.token;
    } catch (error) {
      if (error instanceof EPSError) {
        throw error;
      }
      throw new EPSError(
        `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AUTH_ERROR'
      );
    }
  }

  /**
   * Initialize payment
   *
   * @param params - Payment initialization parameters
   * @returns Payment initialization response with redirect URL
   *
   * @example
   * ```typescript
   * const payment = await eps.initializePayment({
   *   customerOrderId: 'ORD123',
   *   merchantTransactionId: '20240117001',
   *   totalAmount: 1000,
   *   successUrl: 'https://example.com/success',
   *   failUrl: 'https://example.com/fail',
   *   cancelUrl: 'https://example.com/cancel',
   *   customerName: 'John Doe',
   *   customerEmail: 'john@example.com',
   *   customerPhone: '01712345678',
   *   customerAddress: 'Dhaka',
   *   customerCity: 'Dhaka',
   *   customerState: 'Dhaka',
   *   customerPostcode: '1200',
   *   productName: 'Test Product'
   * });
   *
   * // Redirect user to payment page
   * res.redirect(payment.RedirectURL);
   * ```
   */
  async initializePayment(
    params: InitializePaymentParams
  ): Promise<InitializePaymentResponse> {
    // Validate parameters
    validatePaymentParams(params);

    try {
      // Get authentication token
      const token = await this.getToken();

      // Generate hash using merchantTransactionId
      const hash = generateHash(params.merchantTransactionId, this.config.hashKey);

      // Prepare request body
      const requestBody = {
        merchantId: this.config.merchantId,
        storeId: this.config.storeId,
        CustomerOrderId: params.customerOrderId,
        merchantTransactionId: params.merchantTransactionId,
        transactionTypeId: params.transactionTypeId ?? TransactionType.WEB,
        financialEntityId: 0,
        transitionStatusId: 0,
        totalAmount: params.totalAmount,
        ipAddress: params.ipAddress || '0.0.0.0',
        version: '1',
        successUrl: params.successUrl,
        failUrl: params.failUrl,
        cancelUrl: params.cancelUrl,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        CustomerAddress: params.customerAddress,
        CustomerAddress2: params.customerAddress2 || '',
        CustomerCity: params.customerCity,
        CustomerState: params.customerState,
        CustomerPostcode: params.customerPostcode,
        CustomerCountry: params.customerCountry || 'BD',
        CustomerPhone: params.customerPhone,
        ShipmentName: params.shipmentName || '',
        ShipmentAddress: params.shipmentAddress || '',
        ShipmentAddress2: params.shipmentAddress2 || '',
        ShipmentCity: params.shipmentCity || '',
        ShipmentState: params.shipmentState || '',
        ShipmentPostcode: params.shipmentPostcode || '',
        ShipmentCountry: params.shipmentCountry || '',
        ValueA: params.valueA || '',
        ValueB: params.valueB || '',
        ValueC: params.valueC || '',
        ValueD: params.valueD || '',
        ShippingMethod: params.shippingMethod || 'NO',
        NoOfItem: params.noOfItem?.toString() || '1',
        ProductName: params.productName,
        ProductProfile: params.productProfile || 'general',
        ProductCategory: params.productCategory || 'general',
        ProductList: params.productList || [],
      };

      const response = await this.httpClient.post<InitializePaymentResponse>(
        this.getEndpoints().INITIALIZE,
        requestBody,
        {
          headers: {
            'x-hash': hash,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.ErrorMessage || data.ErrorCode) {
        throw new EPSError(
          data.ErrorMessage || 'Payment initialization failed',
          data.ErrorCode || 'INIT_ERROR',
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof EPSError) {
        throw error;
      }
      throw new EPSError(
        `Payment initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'INIT_ERROR'
      );
    }
  }

  /**
   * Verify payment transaction
   *
   * @param params - Transaction ID (merchantTransactionId or epsTransactionId)
   * @returns Transaction verification response
   *
   * @example
   * ```typescript
   * // Verify by merchant transaction ID
   * const status = await eps.verifyPayment({
   *   merchantTransactionId: '20240117001'
   * });
   *
   * // Or verify by EPS transaction ID
   * const status = await eps.verifyPayment({
   *   epsTransactionId: 'C2549190401'
   * });
   *
   * if (status.Status === 'Success') {
   *   console.log('Payment successful!');
   * }
   * ```
   */
  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResponse> {
    if (!params.merchantTransactionId && !params.epsTransactionId) {
      throw new EPSError(
        'Either merchantTransactionId or epsTransactionId is required',
        'INVALID_PARAMS'
      );
    }

    try {
      // Get authentication token
      const token = await this.getToken();

      // Generate hash using the provided transaction ID
      const hashValue = params.merchantTransactionId || params.epsTransactionId!;
      const hash = generateHash(hashValue, this.config.hashKey);

      // Build query string
      const queryParams = new URLSearchParams();
      if (params.merchantTransactionId) {
        queryParams.append('merchantTransactionId', params.merchantTransactionId);
      }
      if (params.epsTransactionId) {
        queryParams.append('EPSTransactionId', params.epsTransactionId);
      }

      const url = `${this.getEndpoints().VERIFY}?${queryParams.toString()}`;

      const response = await this.httpClient.get<VerifyPaymentResponse>(url, {
        headers: {
          'x-hash': hash,
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (data.ErrorMessage || data.ErrorCode) {
        throw new EPSError(
          data.ErrorMessage || 'Transaction verification failed',
          data.ErrorCode || 'VERIFY_ERROR',
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof EPSError) {
        throw error;
      }
      throw new EPSError(
        `Transaction verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'VERIFY_ERROR'
      );
    }
  }

  /**
   * Check if payment was successful
   * @param transactionId - Merchant transaction ID or EPS transaction ID
   * @returns true if payment successful
   */
  async isPaymentSuccessful(transactionId: string): Promise<boolean> {
    try {
      const verification = await this.verifyPayment({
        merchantTransactionId: transactionId,
      });
      return verification.Status.toLowerCase() === 'success';
    } catch {
      return false;
    }
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: AxiosError): EPSError {
    if (error.response) {
      const data = error.response.data as any;
      return new EPSError(
        data?.ErrorMessage || data?.errorMessage || error.message,
        data?.ErrorCode || data?.errorCode || 'HTTP_ERROR',
        data
      );
    }

    if (error.request) {
      return new EPSError('No response from EPS server', 'NETWORK_ERROR');
    }

    return new EPSError(error.message, 'UNKNOWN_ERROR');
  }

  /**
   * Clear cached token (useful for testing)
   */
  public clearToken(): void {
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Get current configuration (sensitive data masked)
   */
  public getConfig(): Partial<EPSConfig> {
    return {
      username: this.config.username,
      merchantId: this.config.merchantId,
      storeId: this.config.storeId,
      sandbox: this.config.sandbox,
    };
  }
}
