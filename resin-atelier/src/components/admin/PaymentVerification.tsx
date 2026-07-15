"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@prisma/client";

export function PaymentVerification({ orderId, status }: { orderId: string; status: PaymentStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"PAID" | "FAILED" | null>(null);

  async function verify(next: "PAID" | "FAILED") {
    setLoading(next);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update payment");
      toast.success(next === "PAID" ? "Payment marked as received" : "Payment marked as failed");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  if (status === "PAID") {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-green-600">
        <CheckCircle2 className="h-3.5 w-3.5" /> Payment verified
      </p>
    );
  }

  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={() => verify("PAID")}
        disabled={loading !== null}
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 rounded-full bg-green-600 px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        )}
      >
        {loading === "PAID" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
        Mark Payment Received
      </button>
      <button
        onClick={() => verify("FAILED")}
        disabled={loading !== null}
        className="flex items-center justify-center gap-1.5 rounded-full border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        {loading === "FAILED" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
        Mark Failed
      </button>
    </div>
  );
}
