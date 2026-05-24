import { Footer } from "@/components/Footer";
import { PublicNavbar } from "@/components/PublicNavbar";

export default function PrivacyPage() {
  return (
    <div>
      <PublicNavbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-black">Privacy Policy</h1>
        <p className="mt-6 leading-8 text-muted-foreground">
          Blitz Solutions uses student data to manage internship registration, task review, support, and document generation. Public verification never exposes private email, phone, college, submitted files, or admin notes.
        </p>
      </main>
      <Footer />
    </div>
  );
}
