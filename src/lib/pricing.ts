import type { CartItem, Totals } from "@/lib/types";

export const FREE_SHIPPING_THRESHOLD = 120;
export const STANDARD_SHIPPING = 9;
export const TAX_RATE = 0.08;

export interface Coupon {
  code: string;
  label: string;
  percent?: number;
  freeShipping?: boolean;
  minSubtotal?: number;
}

export const COUPONS: Coupon[] = [
  { code: "SAVE10", label: "10% off your order", percent: 10 },
  {
    code: "FREESHIP",
    label: "Free standard shipping",
    freeShipping: true,
  },
  {
    code: "AURORA25",
    label: "25% off orders over $300",
    percent: 25,
    minSubtotal: 300,
  },
];

export function findCoupon(code?: string | null): Coupon | undefined {
  if (!code) return undefined;
  return COUPONS.find(
    (coupon) => coupon.code === code.trim().toUpperCase(),
  );
}

export function validateCoupon(
  code: string,
  subtotal: number,
): { ok: true; coupon: Coupon } | { ok: false; message: string } {
  const coupon = findCoupon(code);
  if (!coupon) {
    return { ok: false, message: "That code is not valid." };
  }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      message: `Spend at least $${coupon.minSubtotal} to use ${coupon.code}.`,
    };
  }
  return { ok: true, coupon };
}

export function computeTotals(
  items: Pick<CartItem, "price" | "qty">[],
  couponCode?: string | null,
): Totals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const coupon = findCoupon(couponCode);
  const eligible =
    coupon && (!coupon.minSubtotal || subtotal >= coupon.minSubtotal);

  const discount = eligible && coupon?.percent
    ? Math.round(subtotal * (coupon.percent / 100) * 100) / 100
    : 0;

  const afterDiscount = subtotal - discount;
  const shipping =
    eligible && coupon?.freeShipping
      ? 0
      : afterDiscount >= FREE_SHIPPING_THRESHOLD || afterDiscount === 0
        ? 0
        : STANDARD_SHIPPING;

  const tax = Math.round(afterDiscount * TAX_RATE * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount,
    shipping,
    tax,
    total: Math.round((afterDiscount + shipping + tax) * 100) / 100,
  };
}
