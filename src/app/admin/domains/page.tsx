import { createDomainAction } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/app/actions/admin";
import { AdminHeader } from "@/components/AdminHeader";
import { DataTable, Td, Th } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAdminSummary } from "@/lib/data";

export default async function AdminDomainsPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const { domains } = await getAdminSummary();
  return (
    <>
      <AdminHeader title="Domains" />
      <main className="grid gap-6 p-5">
        <Card><CardHeader><CardTitle>Create Domain</CardTitle></CardHeader><CardContent>
          <form action={createDomainAction} className="grid gap-3 md:grid-cols-5">
            <Input name="name" placeholder="Name" required />
            <Input name="slug" placeholder="Slug" />
            <Input name="description" placeholder="Description" />
            <Input name="duration" placeholder="Duration" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked /> Active</label>
            <Button>Create</Button>
          </form>
        </CardContent></Card>
        <DataTable><thead><tr><Th>Name</Th><Th>Slug</Th><Th>Duration</Th><Th>Active</Th></tr></thead><tbody>{domains.map((d) => <tr key={d.id}><Td>{d.name}</Td><Td>{d.slug}</Td><Td>{d.duration}</Td><Td>{String(d.is_active)}</Td></tr>)}</tbody></DataTable>
      </main>
    </>
  );
}
