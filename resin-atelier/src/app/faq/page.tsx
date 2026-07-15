import { prisma } from "@/lib/prisma";
import { FAQAccordion } from "@/components/FAQAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Frequently Asked Questions" };
export const dynamic = "force-dynamic";

export default async function FAQPage() {
  const faqs = await prisma.fAQItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="container-atelier py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="badge mb-3 bg-lavender-100 text-lavender-600">Help Center</p>
        <h1 className="section-title">Frequently Asked Questions</h1>
        <p className="mt-3 text-ink-500">Everything you need to know about ordering, customizing and caring for your resin pieces.</p>
      </div>
      <FAQAccordion faqs={faqs} />
    </div>
  );
}
