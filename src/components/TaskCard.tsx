import { CheckCircle2, Linkedin, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { DueDateBadge } from "@/components/DueDateBadge";
import { LockedCardOverlay } from "@/components/LockedCardOverlay";
import { SubmitWorkModal } from "@/components/SubmitWorkModal";
import type { Student, Submission, Task } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TaskCard({ task, submission, student }: { task: Task; submission?: Submission; student: Student }) {
  const finalLocked = task.is_final_task && student.status !== "certificate_issued";
  const locked = task.is_locked && !task.is_final_task;
  const submitted = submission && submission.status !== "resubmission_required";
  const status = finalLocked || locked ? "locked" : submission?.status === "approved" ? "completed" : submission?.status ?? "available";

  return (
    <Card className={cn("relative overflow-hidden", task.is_mandatory && "border-l-4 border-l-accent")}>
      <CardHeader>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="rounded-md bg-muted p-2 text-foreground">
            {task.is_mandatory ? <Linkedin className="h-5 w-5" /> : <ListChecks className="h-5 w-5" />}
          </div>
          <StatusBadge status={status} />
        </div>
        <CardTitle className="text-lg">{task.title}</CardTitle>
        <div className="pt-2">
          <DueDateBadge deadline={task.deadline} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-muted-foreground">{task.description}</p>
        {task.key_features?.length ? (
          <div>
            <p className="text-sm font-bold">Key Features</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {task.key_features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {task.expected_outcome ? (
          <div className="rounded-md bg-muted p-3 text-sm">
            <span className="font-bold">Expected Outcome: </span>
            <span className="text-muted-foreground">{task.expected_outcome}</span>
          </div>
        ) : null}
        {submission?.status === "approved" ? (
          <div className="flex gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Completed and approved by Blitz Solutions.
          </div>
        ) : (
          <SubmitWorkModal task={task} disabled={finalLocked || locked || Boolean(submitted)} />
        )}
      </CardContent>
      {finalLocked ? (
        <LockedCardOverlay message="Complete all domain tasks and request your certificate to unlock this step." />
      ) : null}
    </Card>
  );
}
