export const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "7661008991-3@ybl";
export const UPI_PAYEE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Resin Atelier";

/** Build a standard UPI deep link (upi://pay) that any UPI app can open to pre-fill a payment. */
export function buildUpiUri({ amountPaise, note }: { amountPaise: number; note: string }) {
  const amount = (amountPaise / 100).toFixed(2);
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_PAYEE_NAME,
    am: amount,
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}
