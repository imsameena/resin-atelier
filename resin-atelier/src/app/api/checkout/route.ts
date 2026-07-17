import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { addressSchema, customizationSchema } from "@/lib/validations";
import { computeShippingFee } from "@/lib/shipping";
import { generateOrderNumber } from "@/lib/utils";
import { UPI_ID, buildUpiUri } from "@/lib/upi";

const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).max(50),
  customization: customizationSchema.optional(),
});

const requestSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Your cart is empty"),
  address: addressSchema,
  guestEmail: z.string().email().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  orderNotes: z.string().max(500).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    // The session is a JWT that isn't re-validated against the DB on every request,
    // so a stale cookie (e.g. from before a DB reset) can reference a user that no
    // longer exists. Confirm the row is actually there before trusting it below.
    const user = sessionUser
      ? await prisma.user.findUnique({ where: { id: sessionUser.id } })
      : null;
    if (!user && sessionUser) {
      return NextResponse.json(
        { error: "Your session has expired. Please log in again to continue." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    const { items, address, guestEmail, guestName, guestPhone, orderNotes } = parsed.data;

    if (!user && (!guestEmail || !guestName || !guestPhone)) {
      return NextResponse.json(
        { error: "Name, email and phone are required for guest checkout." },
        { status: 400 }
      );
    }

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } });

    if (products.length !== new Set(productIds).size) {
      return NextResponse.json({ error: "One or more items are no longer available." }, { status: 400 });
    }

    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        throw new Error(`Only ${product.stock} left in stock for "${product.name}".`);
      }
      const lineTotal = product.basePrice * item.quantity;
      subtotal += lineTotal;
      return {
        productId: product.id,
        productName: product.name,
        unitPrice: product.basePrice,
        quantity: item.quantity,
        lineTotal,
        customName: item.customization?.customName || null,
        customColor: item.customization?.customColor || null,
        customGlitterColor: item.customization?.customGlitterColor || null,
        customTasselColor: item.customization?.customTasselColor || null,
        customShape: item.customization?.customShape || null,
        customFont: item.customization?.customFont || null,
        customDecoration: item.customization?.customDecoration || null,
        customMessage: item.customization?.customMessage || null,
        customPhotoUrl: item.customization?.customPhotoUrl || null,
        customNotes: item.customization?.customNotes || null,
      };
    });

    const shippingFee = computeShippingFee(subtotal);
    const total = subtotal + shippingFee;

    let addressRecord = null;
    if (user) {
      addressRecord = await prisma.address.create({
        data: { ...address, userId: user.id },
      });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.id ?? null,
          guestEmail: user ? null : guestEmail,
          guestName: user ? null : guestName,
          guestPhone: user ? null : guestPhone,
          addressId: addressRecord?.id ?? null,
          shippingSnapshot: address as any,
          subtotal,
          shippingFee,
          total,
          orderNotes: orderNotes || null,
          status: "PENDING_PAYMENT",
          items: { create: orderItemsData },
          payment: {
            create: {
              amount: total,
              method: "UPI",
              upiId: UPI_ID,
              status: "PENDING",
            },
          },
        },
      });

      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      total,
      upiId: UPI_ID,
      upiUri: buildUpiUri({ amountPaise: total, note: order.orderNumber }),
    });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message || "Unable to place your order." }, { status: 400 });
  }
}
