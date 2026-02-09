# EPS Gateway Node.js SDK

[![npm version](https://img.shields.io/npm/v/eps-gateway-nodejs.svg)](https://www.npmjs.com/package/eps-gateway-nodejs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A well-maintained, unofficial Node.js package for integrating EPS (Easy Payment System) payments. Provides reliable support for initiating and handling transactions with minimal setup.

**Official EPS Website:** [https://www.eps.com.bd](https://www.eps.com.bd)

> **Note:** This is an unofficial SDK created by the developer community. EPS does not provide an official Node.js SDK.

## Features

✅ **TypeScript Support** - Full TypeScript definitions included
✅ **Promise-based API** - Modern async/await syntax
✅ **Automatic Token Management** - Handles JWT token caching and renewal
✅ **HMACSHA512 Hash Generation** - Built-in secure hash utility
✅ **Sandbox & Production** - Easy environment switching
✅ **Input Validation** - Validates all parameters before API calls
✅ **Error Handling** - Comprehensive error messages
✅ **Product List Support** - Multiple products in single transaction
✅ **Zero Dependencies** - Only uses axios for HTTP requests

## Installation

```bash
npm install eps-gateway-nodejs
```

or

```bash
yarn add eps-gateway-nodejs
```

## Quick Start

```javascript
const { EPS, generateTransactionId } = require('eps-gateway-nodejs');

// Initialize EPS
const eps = new EPS({
  username: 'your_username@example.com',
  password: 'your_password',
  hashKey: 'your_hash_key',
  merchantId: 'your-merchant-id',
  storeId: 'your-store-id',
  sandbox: true // Use sandbox for testing
});

// Initialize payment
const payment = await eps.initializePayment({
  customerOrderId: 'ORD123',
  merchantTransactionId: generateTransactionId(),
  totalAmount: 1000,

  successUrl: 'https://yoursite.com/payment/success',
  failUrl: 'https://yoursite.com/payment/fail',
  cancelUrl: 'https://yoursite.com/payment/cancel',

  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '01712345678',
  customerAddress: 'Dhaka',
  customerCity: 'Dhaka',
  customerState: 'Dhaka',
  customerPostcode: '1200',

  productName: 'Test Product'
});

// Redirect user to payment page
console.log('Redirect to:', payment.RedirectURL);

// Verify payment (after callback)
const verification = await eps.verifyPayment({
  merchantTransactionId: 'your_transaction_id'
});

if (verification.Status === 'Success') {
  console.log('Payment successful!');
}
```

## Configuration

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | EPS merchant username (usually email) |
| `password` | string | EPS merchant password |
| `hashKey` | string | Hash key provided by EPS (base64 encoded) |
| `merchantId` | string | Merchant ID (UUID format) |
| `storeId` | string | Store ID (UUID format) |

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sandbox` | boolean | `false` | Use sandbox environment for testing |
| `timeout` | number | `30000` | Request timeout in milliseconds |

### Environment Variables Example

```bash
EPS_USERNAME=merchant@example.com
EPS_PASSWORD=your_password
EPS_HASH_KEY=your_hash_key_base64
EPS_MERCHANT_ID=094980ee-xxxx-xxxx-xxxx-xxxxxxxxxxxx
EPS_STORE_ID=35b518f6-xxxx-xxxx-xxxx-xxxxxxxxxxxx
EPS_SANDBOX=true
```

```javascript
const eps = new EPS({
  username: process.env.EPS_USERNAME,
  password: process.env.EPS_PASSWORD,
  hashKey: process.env.EPS_HASH_KEY,
  merchantId: process.env.EPS_MERCHANT_ID,
  storeId: process.env.EPS_STORE_ID,
  sandbox: process.env.EPS_SANDBOX === 'true'
});
```

## API Reference

### Initialize Payment

```javascript
const payment = await eps.initializePayment(params);
```

#### Required Parameters

```javascript
{
  // Order Information
  customerOrderId: 'ORD123',           // Your unique order ID
  merchantTransactionId: '20240117001', // Unique transaction ID (min 10 digits)
  totalAmount: 1000,                    // Amount in BDT

  // Callback URLs
  successUrl: 'https://yoursite.com/success',
  failUrl: 'https://yoursite.com/fail',
  cancelUrl: 'https://yoursite.com/cancel',

  // Customer Information
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '01712345678',         // Bangladesh format: 01XXXXXXXXX
  customerAddress: 'House 123, Road 456',
  customerCity: 'Dhaka',
  customerState: 'Dhaka',
  customerPostcode: '1200',

  // Product Information
  productName: 'Test Product'
}
```

#### Optional Parameters

```javascript
{
  // Transaction Type
  transactionTypeId: TransactionType.WEB, // WEB=1, ANDROID=2, IOS=3

  // Additional Customer Info
  customerAddress2: 'Sector 7, Uttara',
  customerCountry: 'BD',

  // Shipping Information
  shipmentName: 'John Doe',
  shipmentAddress: 'House 123',
  shipmentCity: 'Dhaka',
  shipmentState: 'Dhaka',
  shipmentPostcode: '1200',
  shipmentCountry: 'BD',

  // Product Details
  productProfile: 'general',
  productCategory: 'Electronics',
  noOfItem: 1,

  // Multiple Products
  productList: [
    {
      ProductName: 'Product 1',
      NoOfItem: 2,
      ProductPrice: 500,
      ProductProfile: 'Description',
      ProductCategory: 'Category'
    }
  ],

  // Custom Values (for your reference)
  valueA: 'custom_data_1',
  valueB: 'custom_data_2',
  valueC: 'custom_data_3',
  valueD: 'custom_data_4',

  // Other
  shippingMethod: 'NO',
  ipAddress: '103.45.67.89'
}
```

#### Response

```javascript
{
  TransactionId: '23e02880-f378-4594-86f8-30ecb5998094',
  RedirectURL: 'https://pg.eps.com.bd/PG?data=...',
  ErrorMessage: '',
  ErrorCode: null
}
```

### Verify Payment

```javascript
// Method 1: Verify by merchant transaction ID
const result = await eps.verifyPayment({
  merchantTransactionId: '20240117001'
});

// Method 2: Verify by EPS transaction ID
const result = await eps.verifyPayment({
  epsTransactionId: 'C2549190401'
});

// Method 3: Quick status check
const isSuccessful = await eps.isPaymentSuccessful('20240117001');
```

#### Response

```javascript
{
  MerchantTransactionId: '20240117001',
  EpsTransactionId: 'C2549190401',
  Status: 'Success', // Success, Failed, Pending
  TotalAmount: '1000.00',
  TransactionDate: '17 Jan 2024 06:30:15 PM',
  TransactionType: 'Purchase',
  FinancialEntity: 'OKWallet', // Payment method used

  // Customer details
  CustomerName: 'John Doe',
  CustomerEmail: 'john@example.com',
  CustomerPhone: '01712345678',

  // Error info (if any)
  ErrorCode: '',
  ErrorMessage: ''
}
```

## Payment Flow

### 1. Initialize Payment

```javascript
const payment = await eps.initializePayment({...});
```

### 2. Redirect User

```javascript
// Redirect user to EPS payment page
res.redirect(payment.RedirectURL);
```

### 3. Handle Callbacks

EPS will redirect users back to your URLs with transaction details:

#### Success URL
```
https://yoursite.com/payment/success?merchantTransactionId=xxx&status=success
```

#### Fail URL
```
https://yoursite.com/payment/fail?merchantTransactionId=xxx&status=failed
```

#### Cancel URL
```
https://yoursite.com/payment/cancel?merchantTransactionId=xxx&status=cancelled
```

### 4. Verify Payment

```javascript
router.get('/payment/success', async (req, res) => {
  const { merchantTransactionId } = req.query;

  // ALWAYS verify with EPS
  const verification = await eps.verifyPayment({ merchantTransactionId });

  if (verification.Status === 'Success') {
    // Payment confirmed - Update your database
    await updateOrderStatus(merchantTransactionId, 'PAID');
    res.render('success', { transaction: verification });
  } else {
    res.redirect('/payment/fail');
  }
});
```

## Express.js Integration

```javascript
const express = require('express');
const { EPS, generateTransactionId } = require('eps-gateway-nodejs');

const app = express();
const eps = new EPS({...});

// Initiate payment
app.post('/payment/initiate', async (req, res) => {
  try {
    const payment = await eps.initializePayment({
      customerOrderId: req.body.orderId,
      merchantTransactionId: generateTransactionId(),
      totalAmount: req.body.amount,
      successUrl: `${req.protocol}://${req.get('host')}/payment/success`,
      failUrl: `${req.protocol}://${req.get('host')}/payment/fail`,
      cancelUrl: `${req.protocol}://${req.get('host')}/payment/cancel`,
      ...req.body.customer,
      productName: req.body.productName
    });

    res.redirect(payment.RedirectURL);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Success callback
app.get('/payment/success', async (req, res) => {
  const verification = await eps.verifyPayment({
    merchantTransactionId: req.query.merchantTransactionId
  });

  if (verification.Status === 'Success') {
    // Update database, send email, etc.
    res.render('payment-success', { data: verification });
  } else {
    res.redirect('/payment/fail');
  }
});
```

## Utility Functions

### Generate Transaction ID

```javascript
const { generateTransactionId } = require('eps-gateway-nodejs');

const txnId = generateTransactionId();
// Returns: 20240117123456789 (17 digits, timestamp-based)
```

### Generate Hash (Advanced)

```javascript
const { generateHash } = require('eps-gateway-nodejs');

const hash = generateHash('value_to_hash', 'your_hash_key');
// Returns: Base64 HMACSHA512 hash
```

## Error Handling

```javascript
const { EPSError } = require('eps-gateway-nodejs');

try {
  const payment = await eps.initializePayment({...});
} catch (error) {
  if (error instanceof EPSError) {
    console.error('EPS Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Response:', error.response);
  } else {
    console.error('Unknown error:', error);
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CONFIG` | Invalid configuration parameters |
| `INVALID_PARAMS` | Invalid payment parameters |
| `AUTH_ERROR` | Authentication failed |
| `INIT_ERROR` | Payment initialization failed |
| `VERIFY_ERROR` | Transaction verification failed |
| `NETWORK_ERROR` | Network/connection error |

## TypeScript Usage

```typescript
import { EPS, InitializePaymentParams, VerifyPaymentResponse, TransactionType } from 'eps-gateway-nodejs';

const eps = new EPS({
  username: 'merchant@example.com',
  password: 'password',
  hashKey: 'hash_key',
  merchantId: 'merchant-id',
  storeId: 'store-id',
  sandbox: true
});

const params: InitializePaymentParams = {
  customerOrderId: 'ORD123',
  merchantTransactionId: '20240117001',
  totalAmount: 1000,
  transactionTypeId: TransactionType.WEB,
  // ... other params
};

const payment = await eps.initializePayment(params);
const verification: VerifyPaymentResponse = await eps.verifyPayment({
  merchantTransactionId: '20240117001'
});
```

## Testing

### Sandbox Mode

```javascript
const eps = new EPS({
  username: 'sandbox_username',
  password: 'sandbox_password',
  hashKey: 'sandbox_hash_key',
  merchantId: 'sandbox-merchant-id',
  storeId: 'sandbox-store-id',
  sandbox: true // Important!
});
```

### Test Credentials

Contact EPS support to get sandbox credentials for testing.

## Examples

Check the `/examples` directory for complete working examples:

- `initialize-payment.js` - Basic payment initialization
- `verify-payment.js` - Payment verification
- `complete-flow.js` - Complete payment flow with Express.js integration

Run examples:

```bash
npm run build
node examples/initialize-payment.js
node examples/verify-payment.js
node examples/complete-flow.js
```

## Best Practices

### 1. Always Verify Payments

Never trust callback URLs alone. Always verify payment status with EPS:

```javascript
// ❌ BAD - Don't trust the callback alone
app.get('/payment/success', async (req, res) => {
  // Directly mark as paid - INSECURE!
  await markOrderAsPaid(req.query.orderId);
});

// ✅ GOOD - Always verify with EPS
app.get('/payment/success', async (req, res) => {
  const verification = await eps.verifyPayment({
    merchantTransactionId: req.query.merchantTransactionId
  });

  if (verification.Status === 'Success') {
    await markOrderAsPaid(req.query.orderId);
  }
});
```

### 2. Store Transaction IDs

```javascript
// Save transaction details before redirecting
await Payment.create({
  orderId: 'ORD123',
  merchantTransactionId: txnId,
  epsTransactionId: payment.TransactionId,
  amount: 1000,
  status: 'INITIATED'
});
```

### 3. Use Environment Variables

```javascript
// Never hardcode credentials
const eps = new EPS({
  username: process.env.EPS_USERNAME,
  password: process.env.EPS_PASSWORD,
  hashKey: process.env.EPS_HASH_KEY,
  merchantId: process.env.EPS_MERCHANT_ID,
  storeId: process.env.EPS_STORE_ID,
  sandbox: process.env.NODE_ENV !== 'production'
});
```

### 4. Handle Errors Gracefully

```javascript
try {
  const payment = await eps.initializePayment(params);
  res.redirect(payment.RedirectURL);
} catch (error) {
  logger.error('Payment initiation failed:', error);
  res.render('payment-error', {
    message: 'Unable to process payment. Please try again.'
  });
}
```

### 5. Use Unique Transaction IDs

```javascript
const { generateTransactionId } = require('eps-gateway-nodejs');

// Always generate unique transaction IDs
const txnId = generateTransactionId(); // Timestamp-based, 17 digits

// Or use your own format (minimum 10 digits)
const customTxnId = `${Date.now()}${Math.random().toString().slice(2, 6)}`;
```

## FAQ

### Q: Is this an official SDK?
**A:** No, this is an unofficial SDK created by the developer community. EPS does not provide an official Node.js SDK.

### Q: How do I get EPS credentials?
**A:** Contact EPS (Easy Payment System) support at info@eps.com.bd or visit www.eps.com.bd

### Q: What's the difference between sandbox and production?
**A:** Sandbox is for testing with test credentials. Production is for real transactions with real money.

### Q: Can I use this in production?
**A:** Yes, but thoroughly test in sandbox mode first. This library is used in production by several projects.

### Q: What payment methods does EPS support?
**A:** EPS supports various methods including bKash, Nagad, Rocket, Bank cards, OKWallet, and more. The actual methods available depend on your EPS merchant account configuration.

### Q: How do I handle webhooks/IPN?
**A:** EPS uses callback URLs (successUrl, failUrl, cancelUrl). Always verify payment status when handling these callbacks.

## Contributing

Suggestions, improvements, and pull requests are always welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/imtiaznajim/eps-gateway-nodejs.git
cd eps-gateway-nodejs
npm install
npm run build
npm test
```

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Disclaimer

This is an unofficial SDK. The author is not affiliated with EPS (Easy Payment System). Use at your own risk.

## Support

- 🐛 **Issues:** [GitHub Issues](https://github.com/imtiaznajim/eps-gateway-nodejs/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/imtiaznajim/eps-gateway-nodejs/discussions)
- ⭐ **Star this repo** if you find it helpful!

## Acknowledgments

- Thanks to [EPS (Easy Payment System)](https://www.eps.com.bd) for providing the payment gateway service
- Built with ❤️ for the Bangladesh developer community



Made with ❤️ for the Bangladesh developer community
