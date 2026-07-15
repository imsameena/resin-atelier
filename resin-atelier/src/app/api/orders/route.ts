import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const isAdminView = searchParams.get("all") === "true";
  const status = searchParams.get("status");

  if (isAdminView && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    where: {
      ...(isAdminView ? {} : { userId: user.id }),
      ...(status ? { status: status as any } : {}),
    },
    include: {
      items: true,
      payment: true,
      address: true,
      ...(isAdminView ? { user: { select: { name: true, email: true } } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}