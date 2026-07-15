import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "gold",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "gold" | "blush" | "lavender" | "ink";
}) {
  const tones: Record<string, string> = {
    gold: "from-gold-100 to-gold-200 text-gold-600",
    blush: "from-blush-100 to-blush-200 text-blush-600",
    lavender: "from-lavender-100 to-lavender-200 text-lavender-600",
    ink: "from-ink-100 to-ink-100 text-ink-700",
  };

  return (
    <div className="card-atelier flex items-center gap-4 p-5">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br", tones[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="font-display text-2xl font-semibold text-ink-900">{value}</p>
      </div>
    </div>
  );
}
