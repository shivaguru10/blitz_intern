import { Download } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Student } from "@/lib/types";
import { absoluteUrl, formatDate } from "@/lib/utils";

export function StudentIdCard({ student }: { student: Student }) {
  const verifyUrl = absoluteUrl(`/verify?query=${student.intern_id}`);
  return (
    <div className="mx-auto max-w-xl rounded-lg border bg-white p-6 shadow-sm">
      <div className="overflow-hidden rounded-lg bg-[radial-gradient(circle_at_85%_20%,rgba(11,124,255,.35),transparent_25%),linear-gradient(135deg,#05070a,#171a21)] p-6 text-white">
        <div className="flex items-center justify-between">
          <Image src="/blitz-logo.png" alt="Blitz Solutions" width={110} height={36} className="rounded bg-white px-2 py-1" />
          <span className="text-5xl font-black text-white/10">ϟ</span>
        </div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-blue-200">Virtual Intern ID</p>
        <h2 className="mt-2 text-3xl font-black">{student.full_name}</h2>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <Info label="Intern ID" value={student.intern_id} />
          <Info label="Domain" value={student.domains?.name ?? "Blitz VIP"} />
          <Info label="Batch" value={student.batches?.name ?? "Active batch"} />
          <Info label="Validity" value={formatDate(student.batches?.end_date)} />
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="grid h-24 w-24 place-items-center rounded bg-white p-2 text-center text-[10px] font-bold text-black">
            QR
            <span className="font-mono text-[8px] break-all">{student.intern_id}</span>
          </div>
          <p className="text-xs text-blue-100">Verification URL: {verifyUrl}</p>
        </div>
      </div>
      <Button className="mt-5 w-full" asChild>
        <a href={`/api/documents/id-card/${student.id}`} target="_blank">
          <Download className="h-4 w-4" />
          Download ID Card
        </a>
      </Button>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-blue-200">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
