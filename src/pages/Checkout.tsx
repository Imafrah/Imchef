import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, Wallet, IndianRupee, Landmark } from 'lucide-react';
import LottieOrderAnimation from '@/components/LottieOrderAnimation';
import { sendOrderNotification } from '@/services/orderService';
import { paymentService, PaymentMethod, PaymentResult } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [upiId, setUpiId] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderSubtotal, setOrderSubtotal] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  const { state, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const notifyOrder = async (method: string, orderData: {
    items: any[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  }) => {
    try {
      // Debug logging to help identify total calculation issues
      console.log('Email calculation debug:', {
        orderData,
        itemsCount: orderData.items.length
      });
      
      await sendOrderNotification({
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        items: orderData.items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total,
        paymentMethod: method,
      });
    } catch (err) {
      // Non-blocking: if email fails, proceed without disrupting the checkout UX
      console.warn('Order email notification failed', err);
    }
  };

  const processPayment = async (method: PaymentMethod, orderData: {
    items: any[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  }): Promise<PaymentResult> => {
    try {
      switch (method) {
        case 'cod':
          return await paymentService.processCODPayment();
        
        case 'upi':
          if (!upiId) {
            return {
              success: false,
              error: 'UPI ID is required',
              method: 'upi'
            };
          }
          return await paymentService.processUPIPayment(upiId, orderData.total);
        
        case 'razorpay':
          return await paymentService.processRazorpayPayment({
            key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_xxxxxxxxxxxxx',
            amount: Math.round(orderData.total * 100),
            currency: 'INR',
            name: 'Noodle Sauce Haven',
            description: 'Order Payment',
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: formData.phone,
            },
          });
        
        case 'stripe':
          return await paymentService.processStripePayment({
            publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_xxxxxxxxxxxxx',
            amount: Math.round(orderData.total * 100),
            currency: 'inr',
            customerEmail: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
          });
        
        case 'card':
          return await paymentService.processCardPayment({
            number: formData.cardNumber,
            expiry: formData.expiryDate,
            cvv: formData.cvv,
            name: formData.nameOnCard,
          });
        
        default:
          return {
            success: false,
            error: 'Invalid payment method',
            method: method
          };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: 'Payment processing failed',
        method: method
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Calculate and store the total before clearing cart
    const currentSubtotal = state.total;
    const currentShipping = currentSubtotal > 0 && currentSubtotal < 500 ? 50 : 0; // ₹50 for orders under ₹500
    const currentTax = currentSubtotal > 0 ? currentSubtotal * 0.18 : 0; // 18% GST
    const currentTotal = currentSubtotal + currentShipping + currentTax;
    
    // Debug logging to check cart state
    console.log('Cart state before processing:', {
      items: state.items,
      total: state.total,
      currentSubtotal,
      currentShipping,
      currentTax,
      currentTotal
    });
    
    setOrderTotal(currentTotal);
    setOrderItems([...state.items]);
    setOrderSubtotal(currentSubtotal);
    
    // Prepare order data for email
    const orderData = {
      items: [...state.items],
      subtotal: currentSubtotal,
      shipping: currentShipping,
      tax: currentTax,
      total: currentTotal
    };
    
    try {
      // Process payment using the payment service
      const paymentResult = await processPayment(paymentMethod, orderData);
      
      if (paymentResult.success) {
        // Payment successful
        setIsProcessing(false);
        setOrderComplete(true);
        notifyOrder(paymentMethod, orderData);
        clearCart();
        
        // Show success message based on payment method
        const successMessages = {
          cod: 'Order placed with Cash on Delivery',
          upi: `UPI payment successful`,
          razorpay: 'Payment successful via Razorpay',
          stripe: 'Payment successful via Stripe',
          card: 'Card payment successful'
        };
        
        toast({ 
          title: successMessages[paymentMethod] || 'Payment successful',
          description: paymentResult.paymentId ? `Payment ID: ${paymentResult.paymentId}` : undefined
        });
      } else {
        // Payment failed
        setIsProcessing(false);
        toast({ 
          title: 'Payment failed', 
          description: paymentResult.error || 'Please try again.' 
        });
      }
    } catch (err) {
      setIsProcessing(false);
      console.error('Checkout error:', err);
      toast({ title: 'Payment failed', description: 'Please try again.' });
    }
  };

  const subtotal = state.total;
  const shipping = subtotal >= 500 ? 0 : 50; // ₹50 for orders under ₹500
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  if (state.items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to your cart before checking out.</p>
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-6 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-foreground">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase! Your order has been confirmed and will be processed shortly.
            </p>
            <LottieOrderAnimation width={250} height={250} />
            <div className="space-y-2 mb-8">
              <p className="text-sm text-muted-foreground">Order Total: <span className="font-semibold text-primary">₹{orderTotal.toFixed(2)}</span></p>
              <p className="text-sm text-muted-foreground">Confirmation email sent to: <span className="font-medium">{formData.email}</span></p>
            </div>
            <div className="space-y-2">
              <Button onClick={() => navigate('/')} className="w-full">
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate('/products')} className="w-full">
                View All Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div 
        className="text-white py-16 relative"
        style={{
          backgroundImage: 'url("/Checkout.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Checkout
          </h1>
          <p className="text-xl text-white/90 animate-slide-up">
            Complete your order securely
          </p>
        </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping & Payment Info */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Method selectors */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <Button type="button" variant={paymentMethod==='card'?'default':'outline'} onClick={()=>setPaymentMethod('card')} className="w-full">
                      <Landmark className="mr-2 h-4 w-4"/> Card
                    </Button>
                    <Button type="button" variant={paymentMethod==='cod'?'default':'outline'} onClick={()=>setPaymentMethod('cod')} className="w-full">
                      <Wallet className="mr-2 h-4 w-4"/> COD
                    </Button>
                    <Button type="button" variant={paymentMethod==='upi'?'default':'outline'} onClick={()=>setPaymentMethod('upi')} className="w-full">
                      <IndianRupee className="mr-2 h-4 w-4"/> UPI
                    </Button>
                    <Button type="button" variant={paymentMethod==='razorpay'?'default':'outline'} onClick={()=>setPaymentMethod('razorpay')} className="w-full">
                      Razorpay
                    </Button>
                    <Button type="button" variant={paymentMethod==='stripe'?'default':'outline'} onClick={()=>setPaymentMethod('stripe')} className="w-full">
                      Stripe
                    </Button>
                  </div>

                  {paymentMethod === 'card' && (
                    <>
                      <div>
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input id="nameOnCard" name="nameOnCard" value={formData.nameOnCard} onChange={handleInputChange} required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={handleInputChange} required className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" name="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleInputChange} required className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" name="cvv" placeholder="123" value={formData.cvv} onChange={handleInputChange} required className="mt-1" />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === 'upi' && (
                    <div>
                      <Label htmlFor="upi">UPI ID</Label>
                      <Input id="upi" placeholder="username@bank" value={upiId} onChange={(e)=>setUpiId(e.target.value)} className="mt-1" />
                      <p className="text-xs text-muted-foreground mt-1">We will send a collect request to this UPI ID.</p>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <p className="text-sm text-muted-foreground">Pay with cash when your order arrives.</p>
                  )}

                  {paymentMethod === 'razorpay' && (
                    <p className="text-sm text-muted-foreground">You will complete payment via Razorpay secure checkout.</p>
                  )}

                  {paymentMethod === 'stripe' && (
                    <p className="text-sm text-muted-foreground">You will complete payment via Stripe secure checkout.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="border-border sticky top-8">
                <CardHeader>
                  <CardTitle className="text-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 py-2 border-b border-border last:border-b-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-foreground">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isProcessing}
                    className="w-full bg-gradient-warm hover:shadow-soft mt-6"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Lock className="mr-2 h-4 w-4" />
                        Place Order - ₹{total.toFixed(2)}
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Your payment information is encrypted and secure
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;