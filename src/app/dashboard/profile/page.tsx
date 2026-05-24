import { redirect } from "next/navigation";
import { updateProfileFormAction } from "@/app/actions/student";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStudentFromSession } from "@/lib/session";

export default async function ProfilePage() {
  const student = await getStudentFromSession();
  if (!student) redirect("/login");
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <StatusBadge status={student.status} />
        </CardHeader>
        <CardContent>
          <form action={updateProfileFormAction} className="grid gap-4">
            <Readonly label="Full name" value={student.full_name} />
            <Readonly label="Email" value={student.email} />
            <Readonly label="Intern ID" value={student.intern_id} />
            <Readonly label="Domain" value={student.domains?.name ?? "Not set"} />
            <Readonly label="Batch" value={student.batches?.name ?? "Not set"} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone" name="phone" defaultValue={student.phone} />
              <Field label="College" name="college" defaultValue={student.college ?? ""} />
              <Field label="Degree" name="degree" defaultValue={student.degree ?? ""} />
              <Field label="Year of study" name="yearOfStudy" defaultValue={student.year_of_study ?? ""} />
            </div>
            <Button>Save profile</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} />
    </div>
  );
}

function Readonly({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="rounded-md border bg-muted px-3 py-2 text-sm">{value}</div>
    </div>
  );
}
