import { redirect } from "next/navigation";
import { StudentNavbar } from "@/components/StudentNavbar";
import { getStudentFromSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const student = await getStudentFromSession();
  if (!student) redirect("/login");

  return (
    <div>
      <StudentNavbar />
      {children}
    </div>
  );
}
