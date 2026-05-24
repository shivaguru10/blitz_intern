import { createTaskAction } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/app/actions/admin";
import { AdminHeader } from "@/components/AdminHeader";
import { DataTable, Td, Th } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAdminSummary } from "@/lib/data";

export default async function AdminTasksPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const { tasks, domains, batches } = await getAdminSummary();
  return (
    <>
      <AdminHeader title="Tasks" />
      <main className="grid gap-6 p-5">
        <Card>
          <CardHeader><CardTitle>Create Task</CardTitle></CardHeader>
          <CardContent>
            <form action={createTaskAction} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Title" name="title" />
                <Select name="domainId"><option value="">All domains</option>{domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
                <Select name="batchId"><option value="">All batches</option>{batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
              </div>
              <Textarea name="description" placeholder="Description" />
              <Textarea name="requirements" placeholder="Requirements" />
              <Textarea name="keyFeatures" placeholder={"Key features, one per line"} />
              <Input name="expectedOutcome" placeholder="Expected outcome" />
              <Input name="resources" placeholder="Resources" />
              <Input name="deadline" type="date" />
              <label className="flex gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked /> Active</label>
              <label className="flex gap-2 text-sm"><input type="checkbox" name="isLocked" /> Locked</label>
              <Button>Create task</Button>
            </form>
          </CardContent>
        </Card>
        <DataTable>
          <thead><tr><Th>Title</Th><Th>Domain</Th><Th>Deadline</Th><Th>Active</Th><Th>Locked</Th></tr></thead>
          <tbody>{tasks.map((task) => <tr key={task.id}><Td>{task.title}</Td><Td>{task.domain_id ?? "All"}</Td><Td>{task.deadline ?? "-"}</Td><Td>{String(task.is_active)}</Td><Td>{String(task.is_locked)}</Td></tr>)}</tbody>
        </DataTable>
      </main>
    </>
  );
}

function Field({ label, name }: { label: string; name: string }) {
  return <div className="space-y-2"><Label>{label}</Label><Input name={name} required /></div>;
}
