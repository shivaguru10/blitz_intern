import { cn } from "@/lib/utils";

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-3 overflow-hidden rounded-full bg-slate-200", className)}>
      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function CircularProgress({ value }: { value: number }) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div
      className="grid h-28 w-28 place-items-center rounded-full"
      style={{ background: `conic-gradient(#0b7cff ${safe * 3.6}deg, rgba(255,255,255,.16) 0deg)` }}
      aria-label={`Internship progress ${safe}%`}
    >
      <div className="grid h-20 w-20 place-items-center rounded-full bg-[#111318] text-white">
        <span className="text-2xl font-black">{safe}%</span>
      </div>
    </div>
  );
}
