import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AdminSidebar } from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login?redirect=/admin");

  return (
    <div className="flex min-h-screen bg-cream-100">
      <AdminSidebar userName={user.name || "Admin"} />
      <main className="flex-1 px-4 py-8 sm:px-8 lg:pl-8">{children}</main>
    </div>
  );
}
