const FLAT_SHIPPING_FEE = 7900; // paise (₹79)
const FREE_SHIPPING_THRESHOLD = 99900; // paise (₹999)

export function computeShippingFee(subtotal: number) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return FLAT_SHIPPING_FEE;
}

export { FLAT_SHIPPING_FEE, FREE_SHIPPING_THRESHOLD };