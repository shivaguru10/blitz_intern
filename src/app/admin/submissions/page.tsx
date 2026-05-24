import { reviewSubmissionAction } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/app/actions/admin";
import { AdminHeader } from "@/components/AdminHeader";
import { DataTable, Td, Th } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAdminSummary } from "@/lib/data";

export default async function AdminSubmissionsPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const { submissions } = await getAdminSummary();
  return (
    <>
      <AdminHeader title="Submissions" />
      <main className="p-5">
        <DataTable>
          <thead><tr><Th>Student</Th><Th>Task</Th><Th>Links</Th><Th>Status</Th><Th>Review</Th></tr></thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <Td>{submission.students?.full_name ?? "-"}</Td>
                <Td>{submission.tasks?.title ?? "-"}</Td>
                <Td>
                  <div className="grid gap-1 text-xs">
                    {submission.github_url ? <a className="underline" href={submission.github_url}>GitHub</a> : null}
                    {submission.live_url ? <a className="underline" href={submission.live_url}>Live</a> : null}
                    {submission.linkedin_url ? <a className="underline" href={submission.linkedin_url}>LinkedIn</a> : null}
                    {submission.drive_url ? <a className="underline" href={submission.drive_url}>File URL</a> : null}
                  </div>
                </Td>
                <Td>{submission.status}</Td>
                <Td>
                  <form action={reviewSubmissionAction} className="grid gap-2">
                    <input type="hidden" name="submissionId" value={submission.id} />
                    <Select name="status" defaultValue={submission.status}>
                      {["under_review","approved","resubmission_required","rejected"].map((status) => <option key={status} value={status}>{status}</option>)}
                    </Select>
                    <Textarea name="feedback" placeholder="Feedback" defaultValue={submission.admin_feedback ?? ""} />
                    <Button size="sm">Save review</Button>
                  </form>
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </main>
    </>
  );
}
