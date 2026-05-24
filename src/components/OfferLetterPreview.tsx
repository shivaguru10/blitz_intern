import type { OfferLetter, Student } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function OfferLetterPreview({ student, offer }: { student: Student; offer?: OfferLetter | null }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">Blitz VIP Offer Letter</p>
      <h2 className="mt-4 text-2xl font-black">Offer Letter for Virtual Internship in {student.domains?.name}</h2>
      <p className="mt-4 text-sm text-muted-foreground">Issued to {student.full_name} on {formatDate(offer?.issue_date)}.</p>
      <p className="mt-3 font-mono text-sm">{offer?.offer_id ?? "Offer ID pending"}</p>
    </div>
  );
}
