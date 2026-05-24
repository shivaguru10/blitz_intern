import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr] lg:px-8">
        <div>
          <BrandLogo />
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            Build real projects. Gain verified experience. Start your career with Blitz Solutions.
          </p>
        </div>
        <nav className="grid gap-3 text-sm sm:grid-cols-2">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/fee-policy">Fee Policy</Link>
          <Link href="/dashboard/help">Contact</Link>
        </nav>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        Copyright {new Date().getFullYear()} Blitz Solutions. All rights reserved.
      </div>
    </footer>
  );
}
