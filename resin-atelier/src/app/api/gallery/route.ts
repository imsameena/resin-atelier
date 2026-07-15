import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" }, take: 12 });
  return NextResponse.json({ images });
}