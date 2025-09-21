// Mock API endpoint for creating Stripe payment intents
// In production, this should be a real backend endpoint

const express = require('express');
const app = express();

app.use(express.json());

// Mock payment intent creation
app.post('/api/create-payment-intent', (req, res) => {
  const { amount, currency, customer_email, customer_name } = req.body;
  
  // In production, you would:
  // 1. Validate the request
  // 2. Create a payment intent using Stripe SDK
  // 3. Return the client_secret
  
  // For demo purposes, return a mock client_secret
  const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
  
  res.json({
    client_secret: mockClientSecret,
    amount: amount,
    currency: currency,
    customer_email: customer_email,
    customer_name: customer_name
  });
});

// For demo purposes, we'll create a simple HTML file that simulates the API
const fs = require('fs');
const path = require('path');

const mockApiContent = `
// Mock API response for Stripe payment intent
// This is a static file that simulates the API response

const mockPaymentIntent = {
  client_secret: 'pi_mock_' + Date.now() + '_secret_' + Math.random().toString(36).substr(2, 9),
  amount: 2000, // $20.00 in cents
  currency: 'usd',
  customer_email: 'customer@example.com',
  customer_name: 'John Doe'
};

// Export for use in frontend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = mockPaymentIntent;
} else if (typeof window !== 'undefined') {
  window.mockPaymentIntent = mockPaymentIntent;
}
`;

fs.writeFileSync(path.join(__dirname, 'mock-payment-intent.js'), mockApiContent);

console.log('Mock API endpoint created at /api/create-payment-intent');
console.log('Mock payment intent file created at /mock-payment-intent.js');
