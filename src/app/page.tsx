import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Footer } from "@/components/Footer";
import { PublicNavbar } from "@/components/PublicNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const domains = [
  "Web Development",
  "Python Development",
  "Java Development",
  "Data Science",
  "AI & Machine Learning",
  "Cyber Security",
  "UI/UX Design",
  "Digital Marketing",
  "Cloud Computing",
  "Full Stack Development",
];

const badges = [
  "Project-based learning",
  "Admin-reviewed submissions",
  "Public certificate verification",
  "Offer letter and certificate",
];

const benefits = [
  "Real-world tasks",
  "Flexible virtual format",
  "Verified certificate",
  "Beginner-friendly",
  "Portfolio-focused",
  "Admin-reviewed completion",
];

const faqs = [
  ["How do I register?", "Choose your internship domain and batch, fill the registration form, and your intern record is created without a student password."],
  ["How do I submit tasks?", "Open your dashboard, choose an available task, and submit project links or notes through the review modal."],
  ["How does certificate verification work?", "A public verification page can confirm issued certificates using a certificate ID or intern ID while keeping private student data hidden."],
  ["Can I order a physical certificate?", "The MVP includes a physical certificate request page. Ordering and payment can be enabled later."],
  ["Where do I get support?", "Use the Help page inside your dashboard to raise a support request."],
];

export default function HomePage() {
  return (
    <div>
      <PublicNavbar />
      <main>
        <section className="blitz-grid bg-white">
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm font-semibold shadow-sm">
                <Zap className="h-4 w-4 text-blue-600" />
                Blitz Solutions Virtual Internship Program
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-foreground sm:text-7xl">
                Launch your career with verified virtual internships
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Join Blitz Solutions Virtual Internship Program, work on real project tasks, submit your work, and earn a verifiable certificate after successful completion.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/register">
                    Apply Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/verify">Verify Certificate</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {badges.map((badge) => (
                  <span key={badge} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold text-muted-foreground">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-xl">
              <div className="rounded-lg bg-[radial-gradient(circle_at_75%_20%,rgba(11,124,255,.30),transparent_30%),linear-gradient(135deg,#111318,#05070a)] p-8 text-white">
                <Sparkles className="h-10 w-10 text-blue-300" />
                <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-blue-200">Blitz VIP</p>
                <h2 className="mt-3 text-4xl font-black">Build real projects. Gain verified experience.</h2>
                <div className="mt-8 grid gap-3 text-sm">
                  {["Register", "Receive intern ID", "Submit work", "Get certified"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-md bg-white/10 p-3">
                      <BadgeCheck className="h-5 w-5 text-blue-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="domains" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight">Internship Domains</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {domains.map((domain) => (
              <Card key={domain}>
                <CardHeader>
                  <CardTitle className="text-base">{domain}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight">How It Works</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {["Register", "Receive Intern ID and offer letter", "Complete assigned project tasks", "Submit your work", "Get reviewed and certified"].map((step, index) => (
                <Card key={step}>
                  <CardHeader>
                    <div className="grid h-10 w-10 place-items-center rounded-md bg-primary text-white">{index + 1}</div>
                    <CardTitle className="text-base">{step}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight">Benefits</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit}>
                <CardContent className="flex items-center gap-3 pt-6">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">{benefit}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight">FAQ</h2>
            <div className="mt-8 grid gap-4">
              {faqs.map(([question, answer]) => (
                <Card key={question}>
                  <CardHeader>
                    <CardTitle className="text-lg">{question}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">{answer}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
