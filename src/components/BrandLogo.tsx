import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)} aria-label="Blitz home">
      <Image src="/blitz-logo.png" alt="Blitz Solutions" width={116} height={40} className="h-8 w-auto object-contain" priority />
      <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:inline">
        Virtual Internship
      </span>
    </Link>
  );
}
