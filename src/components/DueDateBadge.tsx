import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export function DueDateBadge({ deadline }: { deadline?: string | null }) {
  if (!deadline) return <Badge className="bg-slate-100 text-slate-700">No due date</Badge>;
  const due = new Date(deadline);
  const today = new Date();
  const days = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (days < 0) return <Badge className="border-red-200 bg-red-50 text-red-700">Overdue</Badge>;
  if (days === 0) return <Badge className="border-amber-200 bg-amber-50 text-amber-700">Due today</Badge>;
  return <Badge className="border-blue-200 bg-blue-50 text-blue-700">{days} days left · {formatDate(deadline)}</Badge>;
}
