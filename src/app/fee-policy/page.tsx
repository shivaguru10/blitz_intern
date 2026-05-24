import { Footer } from "@/components/Footer";
import { PublicNavbar } from "@/components/PublicNavbar";

export default function FeePolicyPage() {
  return (
    <div>
      <PublicNavbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-black">Fee Policy</h1>
        <p className="mt-6 leading-8 text-muted-foreground">
          The Blitz Solutions Virtual Internship Program may be free to register. Any certificate processing, administrative, or physical certificate fee, if applicable, will be clearly shown before payment. Certificates are issued only after successful project submission and admin approval.
        </p>
      </main>
      <Footer />
    </div>
  );
}
