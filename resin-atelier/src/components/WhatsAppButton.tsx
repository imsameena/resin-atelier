import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
  const message = encodeURIComponent("Hi! I'd love to know more about your resin creations ✨");

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card transition-transform duration-300 hover:scale-110 animate-float"
    >
      <MessageCircle className="h-7 w-7 fill-white" strokeWidth={0} />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 group-hover:animate-none" />
    </a>
  );
}