import { jsPDF } from "jspdf";
import { NextResponse } from "next/server";
import { getStudentFromSession } from "@/lib/session";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { formatDate, absoluteUrl } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const sessionStudent = await getStudentFromSession();
  if (!sessionStudent || sessionStudent.id !== studentId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: student } = await getSupabaseServiceClient()
    .from("students")
    .select("*, domains(*), batches(*), offer_letters(*)")
    .eq("id", studentId)
    .single();

  if (!student) return new NextResponse("Not found", { status: 404 });
  const offer = Array.isArray(student.offer_letters) ? student.offer_letters[0] : student.offer_letters;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth();

  doc.setFillColor(17, 19, 24);
  doc.rect(0, 0, width, 92, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Blitz Solutions", 48, 46);
  doc.setFontSize(10);
  doc.text("Blitz Solutions Virtual Internship Program", 48, 66);
  doc.setDrawColor(11, 124, 255);
  doc.setLineWidth(4);
  doc.line(48, 110, width - 48, 110);
  doc.setTextColor(210, 225, 255);
  doc.setFontSize(90);
  doc.text("ϟ", width - 115, 75);

  doc.setTextColor(17, 19, 24);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${formatDate(offer?.issue_date)}`, 48, 145);
  doc.text(`Offer ID: ${offer?.offer_id ?? "Pending"}`, 48, 162);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Subject: Offer Letter for Virtual Internship in ${student.domains?.name ?? "Selected Domain"}`, 48, 205, { maxWidth: width - 96 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const body = [
    `Dear ${student.full_name},`,
    "We are pleased to offer you a place in the Blitz Solutions Virtual Internship Program. This internship is designed to help you build practical project experience, submit real work for review, and develop a portfolio-ready outcome in your chosen domain.",
    "You are expected to complete assigned tasks with originality, maintain professional communication, and submit your work through the Blitz platform for admin review.",
  ];
  let y = 250;
  body.forEach((line) => {
    const split = doc.splitTextToSize(line, width - 96);
    doc.text(split, 48, y);
    y += split.length * 16 + 14;
  });

  const rows = [
    ["Internship Role", "Virtual Intern"],
    ["Commencement Date", formatDate(student.batches?.start_date)],
    ["Completion Date", formatDate(student.batches?.end_date)],
    ["Work Mode", "Virtual"],
    ["Domain", student.domains?.name ?? "-"],
    ["Intern ID", student.intern_id],
  ];
  rows.forEach(([label, value]) => {
    doc.setFillColor(247, 248, 251);
    doc.rect(48, y, width - 96, 26, "F");
    doc.setFont("helvetica", "bold");
    doc.text(label, 60, y + 17);
    doc.setFont("helvetica", "normal");
    doc.text(value, 250, y + 17);
    y += 31;
  });

  y += 24;
  doc.text("We look forward to seeing your work and growth during the program.", 48, y);
  y += 52;
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatory", 48, y);
  doc.setFont("helvetica", "normal");
  doc.text("Blitz Solutions", 48, y + 16);
  doc.setFontSize(9);
  doc.text("This is an electronically generated document. No physical signature is required.", 48, 760);
  doc.text(`Verification: ${absoluteUrl(`/verify?query=${student.intern_id}`)}`, 48, 776);

  return new NextResponse(Buffer.from(doc.output("arraybuffer")), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename=${student.intern_id}-offer-letter.pdf`,
    },
  });
}
