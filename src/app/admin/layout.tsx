import { AdminSidebar } from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <div>{children}</div>
    </div>
  );
}
