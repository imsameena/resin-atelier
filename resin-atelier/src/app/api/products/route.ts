import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { productSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("q");
  const featured = searchParams.get("featured");
  const includeInactive = searchParams.get("all") === "true";

  const products = await prisma.product.findMany({
    where: {
      ...(includeInactive ? {} : { isActive: true }),
      ...(category ? { category: { slug: category } } : {}),
      ...(featured ? { isFeatured: true } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { images, ...data } = parsed.data;

  const product = await prisma.product.create({
    data: {
      ...data,
      images: { create: images.map((img, idx) => ({ url: img.url, alt: img.alt, sortOrder: idx })) },
    },
    include: { images: true, category: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}