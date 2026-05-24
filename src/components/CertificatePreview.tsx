import type { Certificate, Student } from "@/lib/types";

export function CertificatePreview({ student, certificate }: { student: Student; certificate?: Certificate | null }) {
  return (
    <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">Blitz Solutions</p>
      <h2 className="mt-4 text-3xl font-black">Certificate of Completion</h2>
      <p className="mt-6 text-muted-foreground">Presented to</p>
      <p className="mt-2 text-2xl font-bold">{student.full_name}</p>
      <p className="mt-4 text-sm text-muted-foreground">
        {student.domains?.name} · {certificate?.certificate_id ?? "Pending issue"}
      </p>
    </div>
  );
}
