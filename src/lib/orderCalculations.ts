export interface CartItem {
  price: number;
  quantity: number;
}

export interface Coupon {
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
}

export interface ShippingRule {
  min_order_value: number;
  max_order_value: number | null;
  shipping_cost: number;
}

export interface Tax {
  rate: number;
}

export const orderCalculations = {
  calculateSubtotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  calculateDiscount(subtotal: number, coupon: Coupon | null): number {
    if (!coupon) return 0;
    if (subtotal < coupon.min_order_value) return 0;

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = subtotal * (coupon.discount_value / 100);
    } else {
      discount = Math.min(coupon.discount_value, subtotal);
    }
    return Number(discount.toFixed(2));
  },

  calculateShipping(_subtotalAfterDiscount: number, _rules: ShippingRule[]): number {
    return 0;
  },

  calculateTaxes(_amountToTax: number, _taxes: Tax[]): number {
    return 0;
  },

  calculateOrderTotals(items: CartItem[], coupon: Coupon | null, shippingRules: ShippingRule[], taxes: Tax[]) {
    const subtotal = Number(this.calculateSubtotal(items).toFixed(2));
    const discount = this.calculateDiscount(subtotal, coupon);
    const subtotalAfterDiscount = Math.max(0, subtotal - discount);
    
    const shipping = this.calculateShipping(subtotalAfterDiscount, shippingRules);
    
    const taxableAmount = subtotalAfterDiscount;
    const taxAmount = this.calculateTaxes(taxableAmount, taxes);

    const total = Number((subtotalAfterDiscount + shipping + taxAmount).toFixed(2));

    return {
      subtotal,
      discount,
      shipping: Number(shipping.toFixed(2)),
      taxAmount,
      total
    };
  }
};
