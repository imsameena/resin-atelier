import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  return NextResponse.json({ testimonials });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to leave a review." }, { status: 401 });

  const body = await req.json();
  if (!body.message || !body.rating) {
    return NextResponse.json({ error: "Message and rating are required." }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      userId: user.id,
      name: user.name || "Happy Customer",
      message: body.message,
      rating: Math.min(5, Math.max(1, Number(body.rating))),
      imageUrl: body.imageUrl || null,
      isApproved: false,
    },
  });

  return NextResponse.json({ testimonial }, { status: 201 });
}