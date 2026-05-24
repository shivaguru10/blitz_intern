"use client";

import { ArrowRight, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareBanner({ referralLink }: { referralLink: string }) {
  async function copy() {
    await navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied.");
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({
        title: "Blitz Solutions Virtual Internship Program",
        text: "Build real projects and gain verified experience with Blitz Solutions.",
        url: referralLink,
      });
      return;
    }
    await copy();
  }

  return (
    <section id="share" className="rounded-lg bg-[linear-gradient(135deg,#020409,#0b7cff)] p-5 text-white shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Enjoying Blitz VIP? Share with your friends!</h2>
          <p className="mt-1 text-sm text-blue-100">Invite peers to apply for project-based virtual internships.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={copy}>
            <Copy className="h-4 w-4" />
            Copy referral link
          </Button>
          <Button type="button" onClick={share}>
            <Share2 className="h-4 w-4" />
            Share
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
