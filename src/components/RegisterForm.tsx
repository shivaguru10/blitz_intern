"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerStudentAction, type ActionState } from "@/app/actions/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { registerSchema } from "@/lib/validation";
import type { Batch, Domain } from "@/lib/types";
import type { z } from "zod";

type RegisterValues = z.infer<typeof registerSchema>;

const initialState: ActionState = { ok: false, message: "" };

export function RegisterForm({ domains, batches }: { domains: Domain[]; batches: Batch[] }) {
  const [state, formAction] = useActionState(registerStudentAction, initialState);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (state.message && !state.ok) toast.error(state.message);
  }, [state]);

  return (
    <form
      action={(formData) => startTransition(() => formAction(formData))}
      onSubmit={(event) => void handleSubmit(() => undefined)(event)}
      className="grid gap-4"
    >
      <Field label="Full name" error={errors.fullName?.message}>
        <Input {...register("fullName")} name="fullName" autoComplete="name" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <Input {...register("email")} name="email" type="email" autoComplete="email" />
        </Field>
        <Field label="Phone number" error={errors.phone?.message}>
          <Input {...register("phone")} name="phone" autoComplete="tel" />
        </Field>
      </div>
      <Field label="College name" error={errors.college?.message}>
        <Input {...register("college")} name="college" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Degree" error={errors.degree?.message}>
          <Input {...register("degree")} name="degree" />
        </Field>
        <Field label="Year of study" error={errors.yearOfStudy?.message}>
          <Input {...register("yearOfStudy")} name="yearOfStudy" placeholder="Example: 3rd year" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Internship domain" error={errors.domainId?.message}>
          <Select {...register("domainId")} name="domainId" defaultValue="">
            <option value="" disabled>
              Select domain
            </option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Batch" error={errors.batchId?.message}>
          <Select {...register("batchId")} name="batchId" defaultValue="">
            <option value="" disabled>
              Select batch
            </option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" {...register("terms")} name="terms" className="mt-1" />
        <span>I agree to the Blitz Solutions Virtual Internship Program terms.</span>
      </label>
      {errors.terms?.message ? <p className="text-sm text-destructive">{errors.terms.message}</p> : null}
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Creating record..." : "Create internship account"}
      </Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
