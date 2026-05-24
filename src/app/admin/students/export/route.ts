import { NextResponse } from "next/server";
import { getAdminUser } from "@/app/actions/admin";
import { getAdminSummary } from "@/lib/data";

export async function GET() {
  if (!(await getAdminUser())) return new NextResponse("Unauthorized", { status: 401 });
  const { students } = await getAdminSummary();
  const rows = [
    ["Name", "Email", "Phone", "Domain", "Batch", "Intern ID", "Status", "Created"],
    ...students.map((s) => [s.full_name, s.email, s.phone, s.domains?.name ?? "", s.batches?.name ?? "", s.intern_id, s.status, s.created_at]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv",
      "content-disposition": "attachment; filename=blitz-students.csv",
    },
  });
}
