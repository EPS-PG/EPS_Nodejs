/**
 * Example: Verify Payment Transaction with EPS Gateway
 */

const { EPS } = require('../dist');

// Initialize EPS with your credentials
const eps = new EPS({
  username: 'your_username@example.com',
  password: 'your_password',
  hashKey: 'your_hash_key_from_eps',
  merchantId: 'your-merchant-id-uuid',
  storeId: 'your-store-id-uuid',
  sandbox: true, // Set to false for production
});

async function verifyPayment() {
  try {
    // Method 1: Verify by Merchant Transaction ID
    const merchantTxnId = '20240117123456789';
    const result = await eps.verifyPayment({
      merchantTransactionId: merchantTxnId,
    });

    console.log('✅ Payment verification successful!');
    console.log('\n📊 Transaction Details:');
    console.log('━'.repeat(50));
    console.log('Merchant Transaction ID:', result.MerchantTransactionId);
    console.log('EPS Transaction ID:', result.EpsTransactionId);
    console.log('Status:', result.Status);
    console.log('Amount:', result.TotalAmount, 'BDT');
    console.log('Payment Method:', result.FinancialEntity);
    console.log('Transaction Date:', result.TransactionDate);
    console.log('Transaction Type:', result.TransactionType);
    console.log('\n👤 Customer Information:');
    console.log('━'.repeat(50));
    console.log('Name:', result.CustomerName);
    console.log('Email:', result.CustomerEmail);
    console.log('Phone:', result.CustomerPhone);
    console.log('Address:', result.CustomerAddress);

    // Check payment status
    if (result.Status.toLowerCase() === 'success') {
      console.log('\n✅ Payment successful! Process the order.');
      // Update your database, fulfill order, etc.
      return {
        success: true,
        transactionId: result.EpsTransactionId,
        amount: result.TotalAmount,
      };
    } else {
      console.log('\n❌ Payment not successful. Status:', result.Status);
      return {
        success: false,
        status: result.Status,
      };
    }
  } catch (error) {
    console.error('❌ Payment verification failed:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    throw error;
  }
}

async function verifyByEPSTransactionId() {
  try {
    // Method 2: Verify by EPS Transaction ID
    const epsTransactionId = 'C2549190401';
    const result = await eps.verifyPayment({
      epsTransactionId: epsTransactionId,
    });

    console.log('✅ Payment verified by EPS Transaction ID');
    console.log('Status:', result.Status);
    return result;
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    throw error;
  }
}

async function quickStatusCheck() {
  try {
    // Quick method: Just check if payment was successful
    const merchantTxnId = '20240117123456789';
    const isSuccessful = await eps.isPaymentSuccessful(merchantTxnId);

    if (isSuccessful) {
      console.log('✅ Payment confirmed as successful');
    } else {
      console.log('❌ Payment not successful');
    }

    return isSuccessful;
  } catch (error) {
    console.error('❌ Status check failed:', error.message);
    return false;
  }
}

// Run example
if (require.main === module) {
  console.log('🔍 EPS Payment Verification Examples\n');

  verifyPayment()
    .then(() => {
      console.log('\n━'.repeat(50));
      console.log('✨ Example completed successfully');
    })
    .catch((error) => {
      console.error('\n💥 Example failed:', error.message);
      process.exit(1);
    });
}

module.exports = { verifyPayment, verifyByEPSTransactionId, quickStatusCheck };
