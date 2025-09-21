import { loadStripe, Stripe } from '@stripe/stripe-js';

// Payment method types
export type PaymentMethod = 'card' | 'cod' | 'upi' | 'razorpay' | 'stripe';

// Payment result interface
export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  method: PaymentMethod;
}

// Razorpay configuration
interface RazorpayConfig {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  orderId?: string;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
}

// Stripe configuration
interface StripeConfig {
  publishableKey: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
}

// Payment service class
export class PaymentService {
  private stripe: Stripe | null = null;
  private razorpayKey: string;

  constructor() {
    this.razorpayKey = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_xxxxxxxxxxxxx';
  }

  // Initialize Stripe
  async initializeStripe(publishableKey: string): Promise<Stripe | null> {
    if (!this.stripe) {
      this.stripe = await loadStripe(publishableKey);
    }
    return this.stripe;
  }

  // Load Razorpay script
  private async loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(script);
    });
  }

  // Process Razorpay payment
  async processRazorpayPayment(config: RazorpayConfig): Promise<PaymentResult> {
    try {
      await this.loadRazorpayScript();

      const options = {
        key: this.razorpayKey,
        amount: config.amount,
        currency: config.currency,
        name: config.name,
        description: config.description,
        order_id: config.orderId,
        prefill: config.prefill,
        handler: (response: any) => {
          console.log('Razorpay payment successful:', response);
        },
        modal: {
          ondismiss: () => {
            console.log('Razorpay modal dismissed');
          }
        }
      };

      return new Promise((resolve) => {
        const rzp = new (window as any).Razorpay(options);
        
        rzp.on('payment.failed', (response: any) => {
          console.error('Razorpay payment failed:', response);
          resolve({
            success: false,
            error: response.error.description || 'Payment failed',
            method: 'razorpay'
          });
        });

        rzp.open();
        
        // For demo purposes, we'll simulate success after a delay
        // In production, you should handle the actual payment response
        setTimeout(() => {
          resolve({
            success: true,
            paymentId: `rzp_${Date.now()}`,
            method: 'razorpay'
          });
        }, 2000);
      });
    } catch (error) {
      console.error('Razorpay payment error:', error);
      return {
        success: false,
        error: 'Failed to process Razorpay payment',
        method: 'razorpay'
      };
    }
  }

  // Process Stripe payment
  async processStripePayment(config: StripeConfig): Promise<PaymentResult> {
    try {
      const stripe = await this.initializeStripe(config.publishableKey);
      
      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }

      // For demo purposes, we'll simulate the payment without a real backend
      // In production, you would create a payment intent on your backend
      console.log('Processing Stripe payment:', config);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, always return success
      // In production, you would use stripe.confirmCardPayment() with real payment details
      return {
        success: true,
        paymentId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        method: 'stripe'
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      return {
        success: false,
        error: 'Failed to process Stripe payment',
        method: 'stripe'
      };
    }
  }

  // Process UPI payment (simulation)
  async processUPIPayment(upiId: string, amount: number): Promise<PaymentResult> {
    try {
      // In a real implementation, you would integrate with a UPI service provider
      // For now, we'll simulate the payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success/failure based on UPI ID format
      const isValidUPI = /^[\w.-]+@[\w.-]+$/.test(upiId);
      
      if (!isValidUPI) {
        return {
          success: false,
          error: 'Invalid UPI ID format',
          method: 'upi'
        };
      }

      return {
        success: true,
        paymentId: `upi_${Date.now()}`,
        method: 'upi'
      };
    } catch (error) {
      console.error('UPI payment error:', error);
      return {
        success: false,
        error: 'Failed to process UPI payment',
        method: 'upi'
      };
    }
  }

  // Process Cash on Delivery
  async processCODPayment(): Promise<PaymentResult> {
    // COD doesn't require actual payment processing
    return {
      success: true,
      paymentId: `cod_${Date.now()}`,
      method: 'cod'
    };
  }

  // Process Card payment (mock implementation)
  async processCardPayment(cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  }): Promise<PaymentResult> {
    try {
      // In a real implementation, you would integrate with a payment processor
      // For now, we'll simulate the payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Basic validation
      const isValidCard = this.validateCardDetails(cardDetails);
      
      if (!isValidCard) {
        return {
          success: false,
          error: 'Invalid card details',
          method: 'card'
        };
      }

      return {
        success: true,
        paymentId: `card_${Date.now()}`,
        method: 'card'
      };
    } catch (error) {
      console.error('Card payment error:', error);
      return {
        success: false,
        error: 'Failed to process card payment',
        method: 'card'
      };
    }
  }

  // Validate card details
  private validateCardDetails(cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  }): boolean {
    const { number, expiry, cvv, name } = cardDetails;
    
    // Basic validation
    if (!name.trim()) return false;
    if (!number.replace(/\s/g, '').match(/^\d{13,19}$/)) return false;
    if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) return false;
    if (!cvv.match(/^\d{3,4}$/)) return false;
    
    return true;
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
