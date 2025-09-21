# Payment Integration Setup Guide

This guide will help you set up working payment integrations for your Noodle Sauce Haven application.

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Razorpay Configuration
VITE_RAZORPAY_KEY=rzp_test_your_razorpay_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Optional: Set this to receive order notifications at a specific email
# VITE_ORDER_NOTIFY_EMAIL=admin@yourdomain.com
```

## Payment Methods Available

### 1. Cash on Delivery (COD)
- **Status**: ✅ Working
- **Setup**: No additional setup required
- **Description**: Customer pays when the order is delivered

### 2. UPI Payment
- **Status**: ✅ Working (Simulated)
- **Setup**: No additional setup required
- **Description**: Simulated UPI payment processing

### 3. Razorpay Integration
- **Status**: ✅ Working (Simulated)
- **Setup Required**:
  1. Sign up at [Razorpay](https://razorpay.com/)
  2. Get your API keys from the dashboard
  3. Add `VITE_RAZORPAY_KEY` to your `.env` file
- **Description**: Indian payment gateway with multiple payment options

### 4. Stripe Integration
- **Status**: ✅ Working (Simulated)
- **Setup Required**:
  1. Sign up at [Stripe](https://stripe.com/)
  2. Get your publishable key from the dashboard
  3. Add `VITE_STRIPE_PUBLISHABLE_KEY` to your `.env` file
- **Description**: International payment gateway

### 5. Credit Card (Mock)
- **Status**: ✅ Working (Simulated)
- **Setup**: No additional setup required
- **Description**: Simulated credit card processing

## Production Setup

### For Razorpay (Production):
1. Replace test keys with live keys
2. Implement proper webhook handling
3. Add order verification
4. Set up proper error handling

### For Stripe (Production):
1. Replace test keys with live keys
2. Create a backend API for payment intent creation
3. Implement webhook handling for payment confirmation
4. Add proper error handling and logging

### Backend API Requirements:
For production Stripe integration, you'll need a backend API endpoint:

```javascript
// POST /api/create-payment-intent
{
  "amount": 2000, // Amount in cents
  "currency": "usd",
  "customer_email": "customer@example.com",
  "customer_name": "John Doe"
}

// Response:
{
  "client_secret": "pi_xxx_secret_xxx"
}
```

## Testing

All payment methods are currently set up for testing with simulated responses. To test:

1. Add items to cart
2. Go to checkout
3. Fill in customer details
4. Select a payment method
5. Complete the order

## Security Notes

- Never commit your `.env` file to version control
- Use test keys for development
- Implement proper validation on the backend
- Use HTTPS in production
- Implement proper error handling and logging

## Support

For issues with payment integrations:
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure payment gateway accounts are properly configured
4. Check network requests in browser dev tools
