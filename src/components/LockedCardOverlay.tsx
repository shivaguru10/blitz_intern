import { Lock } from "lucide-react";

export function LockedCardOverlay({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center rounded-lg bg-white/75 p-6 text-center backdrop-blur-[2px]">
      <div>
        <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 font-bold">Certificate Pending</p>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
