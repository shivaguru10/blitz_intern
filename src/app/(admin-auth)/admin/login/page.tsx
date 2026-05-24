import { AdminLoginForm } from "@/components/AdminLoginForm";
import { BrandLogo } from "@/components/BrandLogo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <BrandLogo />
          </div>
          <CardTitle className="text-3xl">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground">Secure email/password authentication through Supabase Auth.</p>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
