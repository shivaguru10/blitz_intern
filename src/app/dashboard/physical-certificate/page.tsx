import { redirect } from "next/navigation";
import { PhysicalCertificateCard } from "@/components/PhysicalCertificateCard";
import { getStudentFromSession } from "@/lib/session";

export default async function PhysicalCertificatePage() {
  const student = await getStudentFromSession();
  if (!student) redirect("/login");
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PhysicalCertificateCard student={student} />
    </main>
  );
}
