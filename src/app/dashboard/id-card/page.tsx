import { redirect } from "next/navigation";
import { StudentIdCard } from "@/components/StudentIdCard";
import { getStudentFromSession } from "@/lib/session";

export default async function IdCardPage() {
  const student = await getStudentFromSession();
  if (!student) redirect("/login");
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-black">Digital Intern ID Card</h1>
      <StudentIdCard student={student} />
    </main>
  );
}
