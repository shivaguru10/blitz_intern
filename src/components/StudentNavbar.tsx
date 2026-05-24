"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, IdCard, LogOut, Menu, RefreshCw, Share2, User, Award, ListChecks } from "lucide-react";
import { logoutStudentAction } from "@/app/actions/student";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Tasks", icon: ListChecks },
  { href: "/dashboard#share", label: "Share with Friends", icon: Share2 },
  { href: "/dashboard/physical-certificate", label: "Physical Certificate", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/help", label: "Help", icon: HelpCircle },
  { href: "/dashboard/id-card", label: "ID Card", icon: IdCard },
];

export function StudentNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <BrandLogo />
        <Button type="button" variant="ghost" size="icon" onClick={() => window.location.reload()} aria-label="Refresh dashboard">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                  active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <form action={logoutStudentAction}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </nav>
        <div className="ml-auto flex gap-2 overflow-x-auto lg:hidden">
          <Button variant="ghost" size="icon" aria-label="Menu">
            <Menu className="h-4 w-4" />
          </Button>
          <form action={logoutStudentAction}>
            <Button type="submit" variant="ghost" size="icon" aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 rounded-full border bg-white px-3 py-1.5 text-xs font-semibold">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
