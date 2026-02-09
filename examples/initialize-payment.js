/**
 * Example: Initialize Payment with EPS Gateway
 */

const { EPS, generateTransactionId } = require('../dist');

// Initialize EPS with your credentials
const eps = new EPS({
  username: 'your_username@example.com',
  password: 'your_password',
  hashKey: 'your_hash_key_from_eps',
  merchantId: 'your-merchant-id-uuid',
  storeId: 'your-store-id-uuid',
  sandbox: true, // Set to false for production
});

async function initializePayment() {
  try {
    const payment = await eps.initializePayment({
      // Order details
      customerOrderId: 'ORD' + Date.now(),
      merchantTransactionId: generateTransactionId(), // Auto-generate unique ID
      totalAmount: 1000, // Amount in BDT

      // Callback URLs
      successUrl: 'https://yourwebsite.com/payment/success',
      failUrl: 'https://yourwebsite.com/payment/fail',
      cancelUrl: 'https://yourwebsite.com/payment/cancel',

      // Customer information
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '01712345678',
      customerAddress: 'House 123, Road 456',
      customerCity: 'Dhaka',
      customerState: 'Dhaka',
      customerPostcode: '1200',
      customerCountry: 'BD',

      // Optional: Customer address 2
      customerAddress2: 'Sector 7, Uttara',

      // Product information
      productName: 'Premium Subscription',
      productCategory: 'Subscription',
      productProfile: 'Monthly Plan',

      // Optional: Multiple products
      productList: [
        {
          ProductName: 'Premium Subscription',
          NoOfItem: 1,
          ProductProfile: 'Monthly Plan',
          ProductCategory: 'Subscription',
          ProductPrice: 1000,
        },
      ],

      // Optional: Shipping information (if applicable)
      shipmentName: 'John Doe',
      shipmentAddress: 'House 123, Road 456',
      shipmentCity: 'Dhaka',
      shipmentState: 'Dhaka',
      shipmentPostcode: '1200',
      shipmentCountry: 'BD',

      // Optional: Custom values for your reference
      valueA: 'user_id_123',
      valueB: 'package_premium',
      valueC: 'campaign_summer2024',
      valueD: '',
    });

    console.log('✅ Payment initialized successfully!');
    console.log('Transaction ID:', payment.TransactionId);
    console.log('Redirect URL:', payment.RedirectURL);
    console.log('\n👉 Redirect user to:', payment.RedirectURL);

    // In your web application, redirect user to payment page
    // res.redirect(payment.RedirectURL);

    return payment;
  } catch (error) {
    console.error('❌ Payment initialization failed:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    if (error.response) {
      console.error('Response:', error.response);
    }
    throw error;
  }
}

// Run example
if (require.main === module) {
  initializePayment()
    .then(() => {
      console.log('\n✨ Example completed successfully');
    })
    .catch((error) => {
      console.error('\n💥 Example failed:', error.message);
      process.exit(1);
    });
}

module.exports = { initializePayment };
