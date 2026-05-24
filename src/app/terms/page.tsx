import { Footer } from "@/components/Footer";
import { PublicNavbar } from "@/components/PublicNavbar";

export default function TermsPage() {
  return <LegalPage title="Terms & Conditions" body="Students are expected to submit original work, follow review instructions, and use Blitz Solutions materials responsibly. Certificates are issued only after successful project submission and admin approval." />;
}

function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <PublicNavbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-black">{title}</h1>
        <p className="mt-6 leading-8 text-muted-foreground">{body}</p>
      </main>
      <Footer />
    </div>
  );
}
