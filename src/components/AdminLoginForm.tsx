"use client";

import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { adminLoginAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = { ok: false, message: "" };

export function AdminLoginForm() {
  const [state, formAction] = useActionState(adminLoginAction, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.message && !state.ok) toast.error(state.message);
  }, [state]);

  return (
    <form action={(formData) => startTransition(() => formAction(formData))} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="email">Admin email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
