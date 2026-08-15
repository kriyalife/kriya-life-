import { Order } from '../types';
import { PRODUCTS } from '../data/products';

export const DEFAULT_FORMSPREE_ID = 'xdaqrjwy';
export const DEFAULT_PREORDER_FORMSPREE_ID = 'xdaqrjwy';

export function getFormspreeId(): string {
  const customId = localStorage.getItem('kriya_formspree_id')?.trim();
  return customId || DEFAULT_FORMSPREE_ID;
}

export function getFormspreeEndpoint(): string {
  const formId = getFormspreeId();
  if (formId.startsWith('http://') || formId.startsWith('https://')) {
    return formId;
  }
  return `https://formspree.io/f/${formId}`;
}

export function saveFormspreeId(id: string): void {
  const cleanId = id.trim().replace(/^https?:\/\/formspree\.io\/f\//i, '');
  if (cleanId) {
    localStorage.setItem('kriya_formspree_id', cleanId);
  } else {
    localStorage.removeItem('kriya_formspree_id');
  }
}

export function getPreorderFormspreeId(): string {
  const customId = localStorage.getItem('kriya_preorder_formspree_id')?.trim();
  return customId || getFormspreeId();
}

export function getPreorderFormspreeEndpoint(): string {
  const formId = getPreorderFormspreeId();
  if (formId.startsWith('http://') || formId.startsWith('https://')) {
    return formId;
  }
  return `https://formspree.io/f/${formId}`;
}

export function savePreorderFormspreeId(id: string): void {
  const cleanId = id.trim().replace(/^https?:\/\/formspree\.io\/f\//i, '');
  if (cleanId) {
    localStorage.setItem('kriya_preorder_formspree_id', cleanId);
  } else {
    localStorage.removeItem('kriya_preorder_formspree_id');
  }
}

export async function sendOrderToFormspree(order: Order): Promise<boolean> {
  const endpoint = getFormspreeEndpoint();

  const customerName = `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim() || 'Valued Customer';
  const email = order.shippingAddress.email || 'customer@example.com';
  const phone = order.shippingAddress.phone || 'N/A';

  const addressFormatted = [
    order.shippingAddress.street,
    order.shippingAddress.apartment,
    order.shippingAddress.city,
    order.shippingAddress.state,
    order.shippingAddress.zipCode,
    order.shippingAddress.country
  ].filter(Boolean).join(', ');

  const itemsListFormatted = order.items.map((item, index) => {
    const shadeInfo = item.selectedShade ? ` (Shade: ${item.selectedShade.name})` : '';
    const unitPrice = item.product.price;
    const itemTotal = unitPrice * item.quantity;
    return `${index + 1}. ${item.product.name}${shadeInfo} | Qty: ${item.quantity} | Price: ₹${unitPrice.toLocaleString('en-IN')} | Total: ₹${itemTotal.toLocaleString('en-IN')}`;
  }).join('\n');

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const payload = {
    _subject: `📦 New KRIYA Order #${order.id} - ${customerName} (₹${order.total.toLocaleString('en-IN')})`,
    order_id: order.id,
    order_date: order.date,
    order_status: order.status,
    customer_name: customerName,
    customer_email: email,
    customer_phone: phone,
    _replyto: email,
    shipping_address: addressFormatted,
    shipping_method: order.shippingMethod === 'express' ? 'Express Delivery' : 'Standard Delivery',
    payment_method: order.paymentMethod,
    payment_detail: order.paymentMethod.toLowerCase().includes('razorpay') || order.paymentMethod.toLowerCase().includes('upi') || order.paymentMethod.toLowerCase().includes('card')
      ? 'Option 1: Razorpay / UPI (GPay, PhonePe, Paytm, BHIM, Cards & NetBanking - 256-Bit SSL Encrypted)'
      : 'Option 2: Cash on Delivery (COD - Doorstep Pay via Cash or UPI)',
    payment_type: order.paymentMethod.toLowerCase().includes('razorpay') || order.paymentMethod.toLowerCase().includes('upi') || order.paymentMethod.toLowerCase().includes('card')
      ? 'Online Payment (Razorpay / UPI)'
      : 'Cash on Delivery (COD)',
    payment_status: order.paymentMethod.toLowerCase().includes('razorpay') || order.paymentMethod.toLowerCase().includes('upi') || order.paymentMethod.toLowerCase().includes('card')
      ? 'Paid / Verified Online'
      : 'Pending (Collect on Delivery)',
    payment_gateway: order.paymentMethod.toLowerCase().includes('razorpay') ? 'Razorpay Gateway (256-Bit SSL)' : 'COD - Doorstep Delivery',
    currency: 'INR (₹)',
    tracking_number: order.trackingNumber,
    items_breakdown: itemsListFormatted,
    items_count: totalQuantity,
    subtotal: `₹${order.subtotal.toLocaleString('en-IN')}`,
    discount_applied: `₹${order.discount.toLocaleString('en-IN')}`,
    shipping_fee: order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`,
    total_amount_paid: `₹${order.total.toLocaleString('en-IN')}`,
    pay_link: order.payLink || `https://checkout.kriyacosmetics.com/pay/${order.id}`
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (error) {
    console.warn('Formspree dispatch notice:', error);
    return false;
  }
}

export async function sendTestNotificationToFormspree(): Promise<boolean> {
  const sampleOrder: Order = {
    id: 'KRIYA-TEST-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    items: [
      {
        product: PRODUCTS[0],
        quantity: 1
      }
    ],
    shippingAddress: {
      firstName: 'Test',
      lastName: 'Customer',
      email: 'test.customer@example.com',
      phone: '+91 98765 43210',
      street: '123 Botanical Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    },
    shippingMethod: 'express',
    shippingCost: 0,
    subtotal: 1499,
    discount: 0,
    tax: 0,
    total: 1499,
    paymentMethod: 'Credit Card (ending 4242)',
    status: 'Processing',
    trackingNumber: 'KR999999999IN',
    payLink: 'https://checkout.kriyacosmetics.com/pay/KRIYA-TEST'
  };

  return sendOrderToFormspree(sampleOrder);
}
