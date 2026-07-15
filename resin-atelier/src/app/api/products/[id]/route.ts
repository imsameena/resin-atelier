import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { productSchema } from "@/lib/validations";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
  });

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { images, ...data } = parsed.data;

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...data,
      ...(images
        ? {
            images: {
              deleteMany: {},
              create: images.map((img, idx) => ({ url: img.url, alt: img.alt, sortOrder: idx })),
            },
          }
        : {}),
    },
    include: { images: true, category: true },
  });

  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.product.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}