"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  value,
  onChange,
  max = 20,
  min = 1,
}: {
  value: number;
  onChange: (val: number) => void;
  max?: number;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center gap-4 rounded-full border border-ink-900/12 bg-white/80 px-4 py-2.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="text-ink-600 transition-colors hover:text-blush-600 disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-5 text-center text-sm font-semibold text-ink-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="text-ink-600 transition-colors hover:text-blush-600 disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
