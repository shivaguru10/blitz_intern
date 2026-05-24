import { cn } from "@/lib/utils";

export function DataTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border bg-white", className)}>
      <table className="w-full min-w-[760px] text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return <th className="border-b bg-muted px-4 py-3 font-bold">{children}</th>;
}

export function Td({ children }: { children: React.ReactNode }) {
  return <td className="border-b px-4 py-3 align-top">{children}</td>;
}
