"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@prisma/client";

export function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) return null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id} className="card-atelier overflow-hidden">
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span className="font-medium text-ink-900">{faq.question}</span>
              <ChevronDown className={cn("h-5 w-5 shrink-0 text-gold-500 transition-transform", isOpen && "rotate-180")} />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-ink-500">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
