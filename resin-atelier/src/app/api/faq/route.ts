import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const faqs = await prisma.fAQItem.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ faqs });
}