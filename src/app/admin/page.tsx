import { AdminHeader } from "@/components/AdminHeader";
import { DataTable, Td, Th } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSummary } from "@/lib/data";

export default async function AdminDashboardPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const { students, submissions, domains, certificates } = await getAdminSummary();
  const byStatus = (status: string) => students.filter((student) => student.status === status).length;
  const submitted = submissions.length;
  const domainCounts = domains.map((domain) => ({
    name: domain.name,
    count: students.filter((student) => student.domain_id === domain.id).length,
  }));

  return (
    <>
      <AdminHeader title="Dashboard" />
      <main className="grid gap-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total interns" value={students.length} />
          <Metric label="Registered" value={byStatus("registered")} />
          <Metric label="Offer issued" value={byStatus("offer_issued")} />
          <Metric label="Submitted" value={submitted} />
          <Metric label="Under review" value={byStatus("under_review")} />
          <Metric label="Approved" value={byStatus("approved")} />
          <Metric label="Certificates issued" value={certificates.length} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Domain-wise Counts</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable>
              <thead><tr><Th>Domain</Th><Th>Interns</Th></tr></thead>
              <tbody>{domainCounts.map((row) => <tr key={row.name}><Td>{row.name}</Td><Td>{row.count}</Td></tr>)}</tbody>
            </DataTable>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable>
              <thead><tr><Th>Student</Th><Th>Task</Th><Th>Status</Th><Th>Submitted</Th></tr></thead>
              <tbody>
                {submissions.slice(0, 8).map((submission) => (
                  <tr key={submission.id}>
                    <Td>{submission.students?.full_name ?? "Student"}</Td>
                    <Td>{submission.tasks?.title ?? "Task"}</Td>
                    <Td>{submission.status}</Td>
                    <Td>{new Date(submission.submitted_at).toLocaleDateString()}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-black">{value}</p>
      </CardContent>
    </Card>
  );
}
import { redirect } from "next/navigation";
import { getAdminUser } from "@/app/actions/admin";
