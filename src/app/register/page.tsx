import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { RegisterForm } from "@/components/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveDomains, getOpenBatches } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const [domains, batches] = await Promise.all([getActiveDomains(), getOpenBatches()]);
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <BrandLogo />
          </div>
          <CardTitle className="text-3xl">Apply for Blitz VIP</CardTitle>
          <p className="text-sm text-muted-foreground">No student password required. Your email and phone number become your login pair.</p>
        </CardHeader>
        <CardContent>
          <RegisterForm domains={domains} batches={batches} />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already registered? <Link className="font-semibold underline" href="/login">Login</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
