"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import type { Testimonial } from "@prisma/client";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-lavender-50/60 to-transparent py-20">
      <div className="container-atelier">
        <div className="mx-auto max-w-2xl text-center">
          <p className="badge mb-3 bg-blush-100 text-blush-600">Loved by many</p>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="card-atelier flex flex-col gap-4 p-6"
            >
              <Quote className="h-6 w-6 text-gold-300" />
              <p className="text-sm leading-relaxed text-ink-600">&ldquo;{t.message}&rdquo;</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-sm font-medium text-ink-900">{t.name}</span>
                <StarRating rating={t.rating} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
