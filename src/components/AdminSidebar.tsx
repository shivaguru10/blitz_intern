import Link from "next/link";
import { LayoutDashboard, ListChecks, Send, Users, Layers, CalendarDays } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/tasks", label: "Tasks", icon: ListChecks },
  { href: "/admin/submissions", label: "Submissions", icon: Send },
  { href: "/admin/domains", label: "Domains", icon: Layers },
  { href: "/admin/batches", label: "Batches", icon: CalendarDays },
];

export function AdminSidebar() {
  return (
    <aside className="border-r bg-white p-4 lg:min-h-screen">
      <BrandLogo />
      <nav className="mt-8 grid gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
