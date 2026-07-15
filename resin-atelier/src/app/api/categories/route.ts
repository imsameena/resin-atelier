import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || null,
      imageUrl: body.imageUrl || null,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return NextResponse.json({ category }, { status: 201 });
}