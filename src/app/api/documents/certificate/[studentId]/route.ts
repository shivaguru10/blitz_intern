import { jsPDF } from "jspdf";
import { NextResponse } from "next/server";
import { getStudentFromSession } from "@/lib/session";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { absoluteUrl, formatDate } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const sessionStudent = await getStudentFromSession();
  if (!sessionStudent || sessionStudent.id !== studentId) return new NextResponse("Unauthorized", { status: 401 });

  const { data } = await getSupabaseServiceClient()
    .from("students")
    .select("*, domains(*), batches(*), certificates(*)")
    .eq("id", studentId)
    .single();
  const certificate = Array.isArray(data?.certificates) ? data?.certificates[0] : data?.certificates;
  if (!data || !certificate) return new NextResponse("Certificate not issued", { status: 404 });

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, width, 595, "F");
  doc.setDrawColor(17, 19, 24);
  doc.setLineWidth(8);
  doc.rect(26, 26, width - 52, 543);
  doc.setDrawColor(11, 124, 255);
  doc.setLineWidth(3);
  doc.rect(42, 42, width - 84, 511);
  doc.setTextColor(235, 240, 248);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(180);
  doc.text("ϟ", width / 2 - 40, 330);
  doc.setTextColor(17, 19, 24);
  doc.setFontSize(18);
  doc.text("Blitz Solutions Virtual Internship Program", width / 2, 105, { align: "center" });
  doc.setFontSize(42);
  doc.text("Certificate of Completion", width / 2, 170, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("This certificate is proudly presented to", width / 2, 225, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.text(data.full_name, width / 2, 275, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(`for successfully completing the ${data.domains?.name ?? "virtual internship"} domain`, width / 2, 318, { align: "center" });
  doc.text(`Duration: ${formatDate(data.batches?.start_date)} - ${formatDate(data.batches?.end_date)}`, width / 2, 345, { align: "center" });
  doc.setFontSize(11);
  doc.text(`Certificate ID: ${certificate.certificate_id}`, 70, 470);
  doc.text(`Intern ID: ${data.intern_id}`, 70, 490);
  doc.text(`Issue Date: ${formatDate(certificate.issue_date)}`, 70, 510);
  doc.text(`Verify: ${absoluteUrl(`/verify?query=${certificate.certificate_id}`)}`, width - 70, 510, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatory", width - 210, 450);

  return new NextResponse(Buffer.from(doc.output("arraybuffer")), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename=${certificate.certificate_id}.pdf`,
    },
  });
}
