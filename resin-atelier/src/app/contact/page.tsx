import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

  return (
    <div className="container-atelier py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="badge mb-3 bg-blush-100 text-blush-600">Get in Touch</p>
        <h1 className="section-title">We&apos;d Love to Hear From You</h1>
        <p className="mt-3 text-ink-500">
          Custom order in mind, or just want to say hi? Reach out and we&apos;ll respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="card-atelier flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blush-100 text-blush-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900">Email</p>
              <p className="text-sm text-ink-500">{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</p>
            </div>
          </div>
          <div className="card-atelier flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lavender-100 text-lavender-600">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900">Phone</p>
              <p className="text-sm text-ink-500">+{whatsapp}</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card-atelier flex items-center gap-4 p-5 transition-colors hover:border-green-300"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900">WhatsApp</p>
              <p className="text-sm text-ink-500">Chat with us instantly</p>
            </div>
          </a>
          <div className="card-atelier flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-100 text-gold-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900">Studio</p>
              <p className="text-sm text-ink-500">Made with love, shipped pan-India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
