import { redirect } from "next/navigation";
import { submitSupportFormAction } from "@/app/actions/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getStudentFromSession } from "@/lib/session";

const faqs = [
  ["Can I update my profile?", "Phone, college, degree, and year of study can be updated from the profile page."],
  ["When is my certificate issued?", "After all required project work is approved by an admin."],
  ["Where can I join the community?", "WhatsApp and Telegram community links can be added by the admin team."],
];

export default async function HelpPage() {
  const student = await getStudentFromSession();
  if (!student) redirect("/login");
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Help & Support</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {faqs.map(([q, a]) => (
            <div key={q} className="rounded-md border p-4">
              <p className="font-bold">{q}</p>
              <p className="mt-1 text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
          <div className="rounded-md bg-muted p-4 text-sm">Support contact: support@blitzsolutions.example · WhatsApp/Telegram community placeholder</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Raise Support Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={submitSupportFormAction} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required />
            </div>
            <Button>Submit request</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
