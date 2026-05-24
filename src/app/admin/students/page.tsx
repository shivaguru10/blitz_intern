import { generateCertificateAction, updateStudentStatusAction } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/app/actions/admin";
import { AdminHeader } from "@/components/AdminHeader";
import { DataTable, Td, Th } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { getAdminSummary } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function AdminStudentsPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const { students } = await getAdminSummary();
  return (
    <>
      <AdminHeader title="Students" />
      <main className="p-5">
        <div className="mb-4 flex justify-end">
          <Button asChild variant="outline"><a href="/admin/students/export">Export CSV</a></Button>
        </div>
        <DataTable>
          <thead>
            <tr><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Domain</Th><Th>Batch</Th><Th>Intern ID</Th><Th>Status</Th><Th>Created</Th><Th>Actions</Th></tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <Td>{student.full_name}</Td>
                <Td>{student.email}</Td>
                <Td>{student.phone}</Td>
                <Td>{student.domains?.name ?? "-"}</Td>
                <Td>{student.batches?.name ?? "-"}</Td>
                <Td><span className="font-mono">{student.intern_id}</span></Td>
                <Td><StatusBadge status={student.status} /></Td>
                <Td>{formatDate(student.created_at)}</Td>
                <Td>
                  <div className="flex flex-col gap-2">
                    <form action={updateStudentStatusAction} className="flex gap-2">
                      <input type="hidden" name="studentId" value={student.id} />
                      <Select name="status" defaultValue={student.status}>
                        {["registered","offer_issued","tasks_assigned","under_review","approved","certificate_issued"].map((status) => <option key={status} value={status}>{status}</option>)}
                      </Select>
                      <Button size="sm">Update</Button>
                    </form>
                    <form action={generateCertificateAction}>
                      <input type="hidden" name="studentId" value={student.id} />
                      <Button size="sm" variant="accent">Generate certificate</Button>
                    </form>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </main>
    </>
  );
}
