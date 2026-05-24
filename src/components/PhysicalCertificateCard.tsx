"use client";

import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { savePhysicalCertificateAction, type ActionState } from "@/app/actions/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Student } from "@/lib/types";

const initialState: ActionState = { ok: false, message: "" };

export function PhysicalCertificateCard({ student }: { student: Student }) {
  const [state, formAction] = useActionState(savePhysicalCertificateAction, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!state.message) return;
    toast[state.ok ? "success" : "error"](state.message);
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Physical Certificate Request</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 rounded-md bg-muted p-4 text-sm sm:grid-cols-3">
          <p><span className="font-bold">Digital status:</span> {student.status}</p>
          <p><span className="font-bold">Request status:</span> Not enabled</p>
          <p><span className="font-bold">Payment status:</span> Pending</p>
        </div>
        <p className="text-sm text-muted-foreground">Physical certificate ordering will be enabled soon.</p>
        <form action={(formData) => startTransition(() => formAction(formData))} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="fullName" defaultValue={student.full_name} />
            <Field label="Phone" name="phone" defaultValue={student.phone} />
          </div>
          <Field label="Address line 1" name="addressLine1" />
          <Field label="Address line 2" name="addressLine2" required={false} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" name="city" />
            <Field label="State" name="state" />
            <Field label="Pincode" name="pincode" />
          </div>
          <Button disabled={isPending}>{isPending ? "Saving..." : "Save address"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, name, defaultValue, required = true }: { label: string; name: string; defaultValue?: string; required?: boolean }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} required={required} />
    </div>
  );
}
