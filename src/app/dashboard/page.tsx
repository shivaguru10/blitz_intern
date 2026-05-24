import { redirect } from "next/navigation";
import { ShareBanner } from "@/components/ShareBanner";
import { TaskLog } from "@/components/TaskLog";
import { WelcomeHeroCard } from "@/components/WelcomeHeroCard";
import { getStudentTasks } from "@/lib/data";
import { getStudentFromSession } from "@/lib/session";
import { absoluteUrl } from "@/lib/utils";

export default async function DashboardPage() {
  const student = await getStudentFromSession();
  if (!student) redirect("/login");
  const { tasks, submissions } = await getStudentTasks(student);

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <WelcomeHeroCard student={student} submissions={submissions} />
      <ShareBanner referralLink={absoluteUrl("/register")} />
      <TaskLog tasks={tasks} submissions={submissions} student={student} />
    </main>
  );
}
