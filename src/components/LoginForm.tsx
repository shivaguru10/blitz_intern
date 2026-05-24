"use client";

import Link from "next/link";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { loginStudentAction, type ActionState } from "@/app/actions/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = { ok: false, message: "" };

export function LoginForm() {
  const [state, formAction] = useActionState(loginStudentAction, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.message && !state.ok) toast.error(state.message);
  }, [state]);

  return (
    <form action={(formData) => startTransition(() => formAction(formData))} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" autoComplete="tel" required />
      </div>
      <p className="text-sm text-muted-foreground">Use the same email and phone number used during registration.</p>
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Checking..." : "Login"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to Blitz VIP?{" "}
        <Link href="/register" className="font-semibold text-foreground underline">
          Register here
        </Link>
      </p>
    </form>
  );
}
