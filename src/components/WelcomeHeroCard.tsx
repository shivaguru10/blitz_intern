import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress, ProgressBar } from "@/components/Progress";
import { StatusBadge } from "@/components/StatusBadge";
import type { Student, Submission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function getProgress(student: Student, submissions: Submission[]) {
  if (student.status === "certificate_issued") return 100;
  if (student.status === "approved") return 90;
  const approvedOrSubmitted = submissions.filter((item) => ["under_review", "submitted", "approved"].includes(item.status));
  if (approvedOrSubmitted.length >= 5) return 70;
  if (approvedOrSubmitted.length > 0) return 50;
  if (student.status === "tasks_assigned") return 35;
  if (student.status === "offer_issued") return 20;
  return 10;
}

export function WelcomeHeroCard({ student, submissions }: { student: Student; submissions: Submission[] }) {
  const progress = getProgress(student, submissions);
  return (
    <section className="overflow-hidden rounded-lg bg-[radial-gradient(circle_at_80%_20%,rgba(11,124,255,.32),transparent_28%),linear-gradient(135deg,#111318,#020409)] p-6 text-white shadow-xl sm:p-8">
      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto]">
        <div className="pointer-events-none absolute -right-8 -top-10 text-[12rem] font-black leading-none text-white/5">ϟ</div>
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-200">Welcome Intern</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{student.full_name}</h1>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-blue-500/20 px-3 py-1 font-bold text-blue-100">{student.domains?.name ?? "Blitz VIP"}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-mono">{student.intern_id}</span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              {formatDate(student.batches?.start_date)} - {formatDate(student.batches?.end_date)}
            </span>
          </div>
          <div className="mt-6">
            <StatusBadge status={student.status} className="border-white/20 bg-white/10 text-white" />
          </div>
        </div>
        <div className="relative flex flex-col items-start gap-4 sm:items-center">
          <CircularProgress value={progress} />
          <p className="text-sm font-semibold text-blue-100">Internship Progress</p>
          <Button asChild variant="accent">
            <a href={`/api/documents/offer/${student.id}`} target="_blank">
              <Download className="h-4 w-4" />
              Download Offer Letter
            </a>
          </Button>
        </div>
      </div>
      <div className="mt-8">
        <ProgressBar value={progress} className="bg-white/15" />
      </div>
    </section>
  );
}
