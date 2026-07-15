"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#FFFDFB",
            color: "#2E2722",
            border: "1px solid rgba(46,39,34,0.08)",
            fontFamily: "var(--font-body)",
          },
        }}
      />
    </SessionProvider>
  );
}