import { TaskCard } from "@/components/TaskCard";
import type { Student, Submission, Task } from "@/lib/types";

export function TaskLog({ tasks, submissions, student }: { tasks: Task[]; submissions: Submission[]; student: Student }) {
  return (
    <section id="tasks">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Blitz VIP</p>
          <h2 className="text-3xl font-black tracking-tight">Blitz Task Log</h2>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            student={student}
            submission={submissions.find((submission) => submission.task_id === task.id)}
          />
        ))}
      </div>
    </section>
  );
}
