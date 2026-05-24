import { Search } from "lucide-react";
import { Footer } from "@/components/Footer";
import { PublicNavbar } from "@/components/PublicNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

type VerifyResult = {
  full_name: string;
  intern_id: string;
  domain_name: string;
  duration: string;
  certificate_id: string;
  issue_date: string;
} | null;

async function verify(query?: string): Promise<VerifyResult> {
  if (!query || !hasSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const supabase = getSupabaseServiceClient();
  const { data } = await supabase.rpc("verify_blitz_certificate", { search_query: query }).maybeSingle();
  return data as VerifyResult;
}

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const result = await verify(params.query);
  return (
    <div>
      <PublicNavbar />
      <main className="mx-auto min-h-[70vh] max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Verify Certificate</CardTitle>
            <p className="text-muted-foreground">Search by Certificate ID or Intern ID.</p>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-3 sm:flex-row">
              <Input name="query" defaultValue={params.query ?? ""} placeholder="BLITZ-CERT-2026-ABC123 or BLITZ-VIP-2026-000001" />
              <Button type="submit">
                <Search className="h-4 w-4" />
                Verify
              </Button>
            </form>

            {params.query ? (
              result ? (
                <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Verified</p>
                  <h2 className="mt-2 text-2xl font-black">{result.full_name}</h2>
                  <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    <p><span className="font-bold">Internship domain:</span> {result.domain_name}</p>
                    <p><span className="font-bold">Duration:</span> {result.duration}</p>
                    <p><span className="font-bold">Intern ID:</span> {result.intern_id}</p>
                    <p><span className="font-bold">Certificate ID:</span> {result.certificate_id}</p>
                    <p><span className="font-bold">Issue date:</span> {formatDate(result.issue_date)}</p>
                  </div>
                  <p className="mt-5 text-sm text-emerald-800">This certificate was issued by Blitz Solutions and is currently verified.</p>
                </div>
              ) : (
                <div className="mt-8 rounded-lg border bg-muted p-6 text-sm font-semibold">
                  Certificate not found or verification is currently disabled.
                </div>
              )
            ) : null}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
