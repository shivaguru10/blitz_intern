import { createBatchAction } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/app/actions/admin";
import { AdminHeader } from "@/components/AdminHeader";
import { DataTable, Td, Th } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAdminSummary } from "@/lib/data";

export default async function AdminBatchesPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const { batches } = await getAdminSummary();
  return (
    <>
      <AdminHeader title="Batches" />
      <main className="grid gap-6 p-5">
        <Card><CardHeader><CardTitle>Create Batch</CardTitle></CardHeader><CardContent>
          <form action={createBatchAction} className="grid gap-3 md:grid-cols-6">
            <Input name="name" placeholder="Batch name" required />
            <Input name="startDate" type="date" />
            <Input name="endDate" type="date" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="registrationOpen" defaultChecked /> Registration open</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked /> Active</label>
            <Button>Create</Button>
          </form>
        </CardContent></Card>
        <DataTable><thead><tr><Th>Name</Th><Th>Start</Th><Th>End</Th><Th>Registration</Th><Th>Active</Th></tr></thead><tbody>{batches.map((b) => <tr key={b.id}><Td>{b.name}</Td><Td>{b.start_date}</Td><Td>{b.end_date}</Td><Td>{String(b.registration_open)}</Td><Td>{String(b.is_active)}</Td></tr>)}</tbody></DataTable>
      </main>
    </>
  );
}
