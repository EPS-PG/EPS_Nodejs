/**
 * EPS Gateway Configuration
 */
export interface EPSConfig {
  /** EPS merchant username */
  username: string;
  /** EPS merchant password */
  password: string;
  /** EPS hash key for HMACSHA512 signing */
  hashKey: string;
  /** Merchant ID provided by EPS */
  merchantId: string;
  /** Store ID provided by EPS */
  storeId: string;
  /** Use sandbox environment (default: false) */
  sandbox?: boolean;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Transaction Type
 */
export enum TransactionType {
  WEB = 1,
  ANDROID = 2,
  IOS = 3,
}

/**
 * Product item in cart
 */
export interface ProductItem {
  /** Product name */
  ProductName: string;
  /** Number of items */
  NoOfItem: string | number;
  /** Product profile/description */
  ProductProfile?: string;
  /** Product category */
  ProductCategory?: string;
  /** Product price */
  ProductPrice: string | number;
}

/**
 * Payment initialization parameters
 */
export interface InitializePaymentParams {
  /** Unique customer order ID */
  customerOrderId: string;
  /** Unique merchant transaction ID (minimum 10 digits) */
  merchantTransactionId: string;
  /** Transaction type (default: WEB) */
  transactionTypeId?: TransactionType;
  /** Total amount to charge */
  totalAmount: number;
  /** Success callback URL */
  successUrl: string;
  /** Failure callback URL */
  failUrl: string;
  /** Cancel callback URL */
  cancelUrl: string;
  /** Customer name */
  customerName: string;
  /** Customer email */
  customerEmail: string;
  /** Customer primary address */
  customerAddress: string;
  /** Customer secondary address (optional) */
  customerAddress2?: string;
  /** Customer city */
  customerCity: string;
  /** Customer state/division */
  customerState: string;
  /** Customer postcode */
  customerPostcode: string;
  /** Customer country code (default: BD) */
  customerCountry?: string;
  /** Customer phone number */
  customerPhone: string;
  /** Shipment name (optional) */
  shipmentName?: string;
  /** Shipment address (optional) */
  shipmentAddress?: string;
  /** Shipment secondary address (optional) */
  shipmentAddress2?: string;
  /** Shipment city (optional) */
  shipmentCity?: string;
  /** Shipment state (optional) */
  shipmentState?: string;
  /** Shipment postcode (optional) */
  shipmentPostcode?: string;
  /** Shipment country (optional) */
  shipmentCountry?: string;
  /** Custom value A (optional) */
  valueA?: string;
  /** Custom value B (optional) */
  valueB?: string;
  /** Custom value C (optional) */
  valueC?: string;
  /** Custom value D (optional) */
  valueD?: string;
  /** Shipping method (optional) */
  shippingMethod?: string;
  /** Number of items (optional) */
  noOfItem?: string | number;
  /** Product name */
  productName: string;
  /** Product profile (optional) */
  productProfile?: string;
  /** Product category (optional) */
  productCategory?: string;
  /** List of products (optional) */
  productList?: ProductItem[];
  /** Customer IP address (optional) */
  ipAddress?: string;
}

/**
 * Token response from GetToken API
 */
export interface TokenResponse {
  /** JWT token */
  token: string;
  /** Token expiration date */
  expireDate: string;
  /** Error message if any */
  errorMessage: string | null;
  /** Error code if any */
  errorCode: string | null;
}

/**
 * Payment initialization response
 */
export interface InitializePaymentResponse {
  /** EPS transaction ID */
  TransactionId: string;
  /** Redirect URL for payment */
  RedirectURL: string;
  /** Error message if any */
  ErrorMessage: string;
  /** Error code if any */
  ErrorCode: string | null;
  /** Financial entity list if any */
  FinancialEntityList: any[] | null;
}

/**
 * Transaction verification parameters
 */
export interface VerifyPaymentParams {
  /** Merchant transaction ID */
  merchantTransactionId?: string;
  /** EPS transaction ID */
  epsTransactionId?: string;
}

/**
 * Transaction verification response
 */
export interface VerifyPaymentResponse {
  /** Merchant transaction ID */
  MerchantTransactionId: string;
  /** EPS transaction ID */
  EpsTransactionId: string;
  /** Transaction status (Success, Failed, Pending, etc.) */
  Status: string;
  /** Total amount */
  TotalAmount: string;
  /** Transaction date */
  TransactionDate: string;
  /** Transaction type */
  TransactionType: string;
  /** Financial entity used (e.g., OKWallet, bKash) */
  FinancialEntity: string;
  /** Error code if any */
  ErrorCode: string;
  /** Error message if any */
  ErrorMessage: string;
  /** Customer ID */
  CustomerId: string;
  /** Customer name */
  CustomerName: string;
  /** Customer email */
  CustomerEmail: string;
  /** Customer address */
  CustomerAddress: string;
  /** Customer secondary address */
  CustomerAddress2: string;
  /** Customer city */
  CustomerCity: string;
  /** Customer state */
  CustomerState: string;
  /** Customer postcode */
  CustomerPostcode: string;
  /** Customer country */
  CustomerCountry: string;
  /** Customer phone */
  CustomerPhone: string;
  /** Shipment name */
  ShipmentName: string;
  /** Shipment address */
  ShipmentAddress: string;
  /** Shipment secondary address */
  ShipmentAddress2: string;
  /** Shipment city */
  ShipmentCity: string;
  /** Shipment state */
  ShipmentState: string;
  /** Shipment postcode */
  ShipmentPostcode: string;
  /** Shipment country */
  ShipmentCountry: string;
  /** Custom value A */
  ValueA: string;
  /** Custom value B */
  ValueB: string;
  /** Custom value C */
  ValueC: string;
  /** Custom value D */
  ValueD: string;
  /** Shipping method */
  ShippingMethod: string;
  /** Number of items */
  NoOfItem: string;
  /** Product name */
  ProductName: string;
  /** Product profile */
  ProductProfile: string;
  /** Product category */
  ProductCategory: string;
  /** Payment reference */
  PaymentReferance?: string;
}

/**
 * EPS Error
 */
export class EPSError extends Error {
  public code?: string;
  public response?: any;

  constructor(message: string, code?: string, response?: any) {
    super(message);
    this.name = 'EPSError';
    this.code = code;
    this.response = response;
    Error.captureStackTrace(this, this.constructor);
  }
}
