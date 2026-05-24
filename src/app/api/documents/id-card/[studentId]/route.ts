import { jsPDF } from "jspdf";
import { NextResponse } from "next/server";
import { getStudentFromSession } from "@/lib/session";
import { absoluteUrl, formatDate } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const student = await getStudentFromSession();
  if (!student || student.id !== studentId) return new NextResponse("Unauthorized", { status: 401 });

  const doc = new jsPDF({ unit: "pt", format: [360, 230] });
  doc.setFillColor(17, 19, 24);
  doc.roundedRect(0, 0, 360, 230, 10, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Blitz VIP", 24, 36);
  doc.setTextColor(11, 124, 255);
  doc.setFontSize(52);
  doc.text("ϟ", 295, 48);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text(student.full_name, 24, 92);
  doc.setFontSize(10);
  doc.text(`Intern ID: ${student.intern_id}`, 24, 120);
  doc.text(`Domain: ${student.domains?.name ?? "Blitz VIP"}`, 24, 138);
  doc.text(`Batch: ${student.batches?.name ?? "Active batch"}`, 24, 156);
  doc.text(`Valid till: ${formatDate(student.batches?.end_date)}`, 24, 174);
  doc.setFillColor(255, 255, 255);
  doc.rect(270, 130, 62, 62, "F");
  doc.setTextColor(17, 19, 24);
  doc.setFontSize(9);
  doc.text("QR", 296, 160, { align: "center" });
  doc.setTextColor(180, 205, 255);
  doc.setFontSize(7);
  doc.text(absoluteUrl(`/verify?query=${student.intern_id}`), 24, 210, { maxWidth: 310 });

  return new NextResponse(Buffer.from(doc.output("arraybuffer")), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename=${student.intern_id}-id-card.pdf`,
    },
  });
}
