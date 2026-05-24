import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo />
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/#domains">Domains</Link>
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/verify">Verify Certificate</Link>
          <Link href="/login">Login</Link>
        </nav>
        <Button asChild size="sm">
          <Link href="/register">
            <ShieldCheck className="h-4 w-4" />
            Register
          </Link>
        </Button>
      </div>
    </header>
  );
}
