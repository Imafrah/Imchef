import emailjs from '@emailjs/browser';

export type OrderItemPayload = {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
};

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

export type OrderPayload = {
  customer: CustomerInfo;
  items: OrderItemPayload[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
};

/**
 * Sends order details via EmailJS. Configure the following env variables in a .env file:
 * - VITE_EMAILJS_SERVICE_ID
 * - VITE_EMAILJS_TEMPLATE_ID
 * - VITE_EMAILJS_PUBLIC_KEY
 *
 * Your EmailJS template can use variables: customer_name, customer_email,
 * customer_phone, address, items_json, totals_json, payment_method
 */
export async function sendOrderNotification(order: OrderPayload): Promise<void> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;
  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL as string) || '';
  const adminTemplateId = (import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID as string) || templateId;

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS environment variables are missing. Skipping email send.');
    return;
  }

  try {

  // Generate order number and date
  const orderNumber = `NSH-${Date.now()}`;
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Format payment method for display
  const paymentMethodDisplay = {
    'card': 'Credit Card',
    'cod': 'Cash on Delivery',
    'upi': 'UPI Payment',
    'razorpay': 'Razorpay'
  }[order.paymentMethod] || order.paymentMethod;

  // Format shipping text
  const shippingText = order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`;

  // Format items as simple text list
  const itemsList = order.items.map(item => 
    `• ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  // Debug logging to check order data
  console.log('Order data being sent to email:', {
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    itemsList
  });

  const templateParams = {
    // Send email to the customer who placed the order
    email: order.customer.email,
    customer_name: `${order.customer.firstName} ${order.customer.lastName}`,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    address: `${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}`,
    payment_method: paymentMethodDisplay,
    order_number: orderNumber,
    order_date: orderDate,
    subtotal: order.subtotal.toFixed(2),
    shipping: order.shipping.toFixed(2),
    shipping_text: shippingText,
    tax: order.tax.toFixed(2),
    total: order.total.toFixed(2),
    // Formatted items as simple list
    items_json: itemsList,
    totals_json: JSON.stringify({
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
    }, null, 2),
  } as Record<string, any>;

    await emailjs.init(publicKey);
    // Send to customer
    await emailjs.send(serviceId, templateId, templateParams);
    console.log('Order notification email sent to customer');

    // Optionally send a copy to admin
    if (adminEmail) {
      const adminParams = {
        ...templateParams,
        email: adminEmail,
        // Preserve who placed the order for the admin copy
        original_customer_email: templateParams.customer_email,
        admin_copy: 'true'
      } as Record<string, any>;
      await emailjs.send(serviceId, adminTemplateId, adminParams);
      console.log('Order notification email sent to admin');
    }
  } catch (error) {
    console.error('Failed to send order notification email:', error);
    throw error;
  }
}


