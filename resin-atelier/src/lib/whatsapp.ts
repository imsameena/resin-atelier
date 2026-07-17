// Sends a plain-text WhatsApp message via the Meta WhatsApp Cloud API.
// Used to alert the shop owner (ADMIN_WHATSAPP_NUMBER) when a customer confirms
// payment on an order. Requires WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID
// from a Meta for Developers WhatsApp app — see README for setup steps.
export async function sendWhatsAppMessage(to: string, body: string): Promise<void> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId || !to) {
    console.warn("WhatsApp notification skipped: missing WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, or recipient.");
    return;
  }

  const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`WhatsApp API error (${res.status}): ${detail}`);
  }
}

export function buildOrderNotificationMessage(order: {
  orderNumber: string;
  total: number;
  guestName?: string | null;
  guestPhone?: string | null;
  orderNotes?: string | null;
  utrNumber?: string | null;
  shippingSnapshot: any;
  user?: { name: string | null; phone?: string | null } | null;
  items: { productName: string; quantity: number; lineTotal: number }[];
}): string {
  const address = order.shippingSnapshot ?? {};
  const customerName = order.user?.name ?? order.guestName ?? "Customer";
  const customerPhone = order.guestPhone ?? address.phone ?? "N/A";

  const itemLines = order.items
    .map((i) => `- ${i.productName} x${i.quantity} = Rs.${(i.lineTotal / 100).toFixed(2)}`)
    .join("\n");

  const addressLines = [
    address.fullName,
    address.line1,
    address.line2,
    [address.city, address.state, address.pincode].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join("\n");

  return [
    `🛒 New order confirmed: ${order.orderNumber}`,
    `Customer: ${customerName} (${customerPhone})`,
    ``,
    `Items:`,
    itemLines,
    ``,
    `Total: Rs.${(order.total / 100).toFixed(2)}`,
    order.utrNumber ? `UTR: ${order.utrNumber}` : null,
    order.orderNotes ? `Notes: ${order.orderNotes}` : null,
    ``,
    `Delivery Address:`,
    addressLines || "N/A",
  ]
    .filter((line) => line !== null)
    .join("\n");
}
