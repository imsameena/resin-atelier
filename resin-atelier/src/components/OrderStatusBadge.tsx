import { cn, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/utils";

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("badge", ORDER_STATUS_COLORS[status] || "bg-ink-100 text-ink-600")}>
      {ORDER_STATUS_LABELS[status] || status}
    </span>
  );
}
