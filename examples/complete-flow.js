/**
 * Example: Complete Payment Flow with EPS Gateway
 * This demonstrates a typical payment integration flow
 */

const { EPS, generateTransactionId } = require('../dist');

// Initialize EPS
const eps = new EPS({
  username: 'your_username@example.com',
  password: 'your_password',
  hashKey: 'your_hash_key_from_eps',
  merchantId: 'your-merchant-id-uuid',
  storeId: 'your-store-id-uuid',
  sandbox: true,
});

/**
 * Step 1: Initialize Payment
 * This is called when user clicks "Pay Now" button
 */
async function step1_InitiatePayment(orderData) {
  console.log('📝 Step 1: Initiating payment...\n');

  const merchantTxnId = generateTransactionId();

  const payment = await eps.initializePayment({
    customerOrderId: orderData.orderId,
    merchantTransactionId: merchantTxnId,
    totalAmount: orderData.amount,

    successUrl: `${orderData.baseUrl}/payment/success`,
    failUrl: `${orderData.baseUrl}/payment/fail`,
    cancelUrl: `${orderData.baseUrl}/payment/cancel`,

    customerName: orderData.customer.name,
    customerEmail: orderData.customer.email,
    customerPhone: orderData.customer.phone,
    customerAddress: orderData.customer.address,
    customerCity: orderData.customer.city,
    customerState: orderData.customer.state || orderData.customer.city,
    customerPostcode: orderData.customer.postcode,

    productName: orderData.product.name,
    productCategory: orderData.product.category,

    // Store merchant transaction ID in your database with order
    valueA: orderData.orderId, // Your order ID
    valueB: orderData.customer.userId, // Your user ID
  });

  console.log('✅ Payment initialized');
  console.log('Transaction ID:', merchantTxnId);
  console.log('Payment URL:', payment.RedirectURL);

  // Save to database
  // await savePaymentRecord({
  //   orderId: orderData.orderId,
  //   merchantTxnId: merchantTxnId,
  //   epsTransactionId: payment.TransactionId,
  //   amount: orderData.amount,
  //   status: 'INITIATED',
  //   redirectUrl: payment.RedirectURL
  // });

  return {
    merchantTransactionId: merchantTxnId,
    redirectUrl: payment.RedirectURL,
  };
}

/**
 * Step 2: Handle Success Callback
 * This is called when EPS redirects to your successUrl
 */
async function step2_HandleSuccess(query) {
  console.log('\n✅ Step 2: Payment success callback received\n');
  console.log('Query params:', query);

  // Extract transaction ID from query parameters
  // EPS sends: ?transactionId=xxx&status=success (check EPS docs for exact params)
  const merchantTxnId = query.transactionId || query.merchantTransactionId;

  // Verify the payment with EPS
  const verification = await eps.verifyPayment({
    merchantTransactionId: merchantTxnId,
  });

  console.log('Payment Status:', verification.Status);
  console.log('Amount:', verification.TotalAmount, 'BDT');
  console.log('Payment Method:', verification.FinancialEntity);

  if (verification.Status.toLowerCase() === 'success') {
    // Payment confirmed - Update your database
    console.log('✅ Payment verified successfully!');

    // Update order status in database
    // await updateOrderStatus({
    //   merchantTxnId: merchantTxnId,
    //   epsTransactionId: verification.EpsTransactionId,
    //   status: 'PAID',
    //   paidAt: new Date(),
    //   paymentMethod: verification.FinancialEntity
    // });

    // Send confirmation email
    // await sendOrderConfirmationEmail(verification.CustomerEmail);

    return {
      success: true,
      message: 'Payment successful',
      transactionId: verification.EpsTransactionId,
    };
  } else {
    console.log('❌ Payment verification failed');
    return {
      success: false,
      message: 'Payment not confirmed',
      status: verification.Status,
    };
  }
}

/**
 * Step 3: Handle Failure Callback
 * This is called when EPS redirects to your failUrl
 */
async function step3_HandleFailure(query) {
  console.log('\n❌ Step 3: Payment failure callback received\n');

  const merchantTxnId = query.transactionId || query.merchantTransactionId;

  // Update database
  // await updateOrderStatus({
  //   merchantTxnId: merchantTxnId,
  //   status: 'FAILED',
  //   failedAt: new Date()
  // });

  console.log('Payment failed for transaction:', merchantTxnId);

  return {
    success: false,
    message: 'Payment failed',
  };
}

/**
 * Step 4: Handle Cancel Callback
 * This is called when user cancels the payment
 */
async function step4_HandleCancel(query) {
  console.log('\n🚫 Step 4: Payment cancelled by user\n');

  const merchantTxnId = query.transactionId || query.merchantTransactionId;

  // Update database
  // await updateOrderStatus({
  //   merchantTxnId: merchantTxnId,
  //   status: 'CANCELLED',
  //   cancelledAt: new Date()
  // });

  console.log('Payment cancelled for transaction:', merchantTxnId);

  return {
    success: false,
    message: 'Payment cancelled',
  };
}

/**
 * Complete Example Flow
 */
async function completeFlowExample() {
  console.log('🚀 EPS Payment Gateway - Complete Flow Example');
  console.log('═'.repeat(60));

  // Sample order data
  const orderData = {
    orderId: 'ORD' + Date.now(),
    amount: 1500,
    baseUrl: 'https://yourwebsite.com',
    product: {
      name: 'Premium Package',
      category: 'Subscription',
    },
    customer: {
      userId: 'USER123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '01712345678',
      address: 'House 123, Road 456, Uttara',
      city: 'Dhaka',
      state: 'Dhaka',
      postcode: '1230',
    },
  };

  try {
    // Step 1: Initialize payment
    const payment = await step1_InitiatePayment(orderData);

    console.log('\n👉 User should be redirected to:');
    console.log(payment.redirectUrl);
    console.log('\n⏳ Waiting for user to complete payment...');
    console.log('(User pays on EPS portal and gets redirected back)\n');

    // Simulate success callback (in reality, this comes from EPS redirect)
    console.log('═'.repeat(60));
    const successQuery = {
      merchantTransactionId: payment.merchantTransactionId,
      status: 'success',
    };

    // Step 2: Handle success callback
    const result = await step2_HandleSuccess(successQuery);

    console.log('\n📋 Final Result:', result);
    console.log('═'.repeat(60));

    return result;
  } catch (error) {
    console.error('\n💥 Error in payment flow:', error.message);
    throw error;
  }
}

// Express.js integration example
function expressIntegrationExample() {
  console.log('\n📦 Express.js Integration Example:\n');
  console.log(`
// routes/payment.js
const express = require('express');
const { EPS, generateTransactionId } = require('eps-gateway-nodejs');
const router = express.Router();

const eps = new EPS({
  username: process.env.EPS_USERNAME,
  password: process.env.EPS_PASSWORD,
  hashKey: process.env.EPS_HASH_KEY,
  merchantId: process.env.EPS_MERCHANT_ID,
  storeId: process.env.EPS_STORE_ID,
  sandbox: process.env.NODE_ENV !== 'production'
});

// Initiate payment
router.post('/payment/initiate', async (req, res) => {
  try {
    const { orderId, amount, customer } = req.body;
    const merchantTxnId = generateTransactionId();

    const payment = await eps.initializePayment({
      customerOrderId: orderId,
      merchantTransactionId: merchantTxnId,
      totalAmount: amount,
      successUrl: \`\${req.protocol}://\${req.get('host')}/payment/success\`,
      failUrl: \`\${req.protocol}://\${req.get('host')}/payment/fail\`,
      cancelUrl: \`\${req.protocol}://\${req.get('host')}/payment/cancel\`,
      ...customer,
      productName: 'Order #' + orderId
    });

    // Save to database
    await Payment.create({
      orderId,
      merchantTxnId,
      epsTransactionId: payment.TransactionId,
      amount,
      status: 'INITIATED'
    });

    // Redirect to payment page
    res.redirect(payment.RedirectURL);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Success callback
router.get('/payment/success', async (req, res) => {
  const { merchantTransactionId } = req.query;

  const verification = await eps.verifyPayment({ merchantTransactionId });

  if (verification.Status === 'Success') {
    await Payment.updateOne(
      { merchantTxnId: merchantTransactionId },
      { status: 'PAID', epsTransactionId: verification.EpsTransactionId }
    );
    res.render('payment-success', { transaction: verification });
  } else {
    res.redirect('/payment/fail');
  }
});

// Failure callback
router.get('/payment/fail', async (req, res) => {
  const { merchantTransactionId } = req.query;
  await Payment.updateOne({ merchantTxnId: merchantTransactionId }, { status: 'FAILED' });
  res.render('payment-failed');
});

// Cancel callback
router.get('/payment/cancel', async (req, res) => {
  const { merchantTransactionId } = req.query;
  await Payment.updateOne({ merchantTxnId: merchantTransactionId }, { status: 'CANCELLED' });
  res.render('payment-cancelled');
});

module.exports = router;
  `);
}

// Run example
if (require.main === module) {
  completeFlowExample()
    .then(() => {
      expressIntegrationExample();
      console.log('\n✨ Example completed');
    })
    .catch((error) => {
      console.error('\n💥 Example failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  step1_InitiatePayment,
  step2_HandleSuccess,
  step3_HandleFailure,
  step4_HandleCancel,
};
