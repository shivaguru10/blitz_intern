import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusMap: Record<string, string> = {
  registered: "Registered",
  offer_issued: "Offer Issued",
  tasks_assigned: "Tasks Assigned",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  certificate_issued: "Certificate Issued",
  available: "Available",
  completed: "Completed",
  locked: "Locked",
  resubmission_required: "Resubmission Required",
  rejected: "Rejected",
};

const toneMap: Record<string, string> = {
  registered: "border-slate-300 bg-slate-100 text-slate-700",
  offer_issued: "border-blue-200 bg-blue-50 text-blue-700",
  tasks_assigned: "border-blue-200 bg-blue-50 text-blue-700",
  submitted: "border-amber-200 bg-amber-50 text-amber-700",
  under_review: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  certificate_issued: "border-emerald-200 bg-emerald-50 text-emerald-700",
  available: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  locked: "border-slate-300 bg-slate-100 text-slate-600",
  resubmission_required: "border-red-200 bg-red-50 text-red-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge className={cn(toneMap[status] ?? "bg-muted text-foreground", className)}>
      {statusMap[status] ?? status}
    </Badge>
  );
}
