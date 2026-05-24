"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { clearStudentSession, getStudentFromSession, setStudentSession } from "@/lib/session";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  loginSchema,
  physicalCertificateSchema,
  profileSchema,
  registerSchema,
  submissionSchema,
  supportSchema,
} from "@/lib/validation";

export type ActionState = {
  ok: boolean;
  message: string;
};

function formString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function normalizePhone(value: string) {
  return value.replace(/\s+/g, "");
}

function requireDb() {
  if (!hasSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured. Fill .env.local and run the migration/seed first.");
  }
  return getSupabaseServiceClient();
}

export async function registerStudentAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const parsed = registerSchema.parse({
      fullName: formString(formData, "fullName"),
      email: formString(formData, "email").toLowerCase(),
      phone: normalizePhone(formString(formData, "phone")),
      college: formString(formData, "college"),
      degree: formString(formData, "degree"),
      yearOfStudy: formString(formData, "yearOfStudy"),
      domainId: formString(formData, "domainId"),
      batchId: formString(formData, "batchId"),
      terms: formData.get("terms") === "on",
    });

    const supabase = requireDb();
    const { data: existing } = await supabase
      .from("students")
      .select("id")
      .or(`email.eq.${parsed.email},phone.eq.${parsed.phone}`)
      .limit(1);

    if (existing && existing.length > 0) {
      return { ok: false, message: "A student record already exists for this email or phone number." };
    }

    const { count } = await supabase.from("students").select("id", { count: "exact", head: true });
    const serial = String((count ?? 0) + 1).padStart(6, "0");
    const year = new Date().getFullYear();
    const internId = `BLITZ-VIP-${year}-${serial}`;
    const offerId = `BLITZ-OFFER-${year}-${serial}`;

    const { data: student, error } = await supabase
      .from("students")
      .insert({
        full_name: parsed.fullName,
        email: parsed.email,
        phone: parsed.phone,
        college: parsed.college,
        degree: parsed.degree,
        year_of_study: parsed.yearOfStudy,
        domain_id: parsed.domainId,
        batch_id: parsed.batchId,
        intern_id: internId,
        status: "offer_issued",
      })
      .select("id")
      .single();

    if (error || !student) {
      return { ok: false, message: error?.message ?? "Registration failed. Please try again." };
    }

    await supabase.from("offer_letters").insert({
      student_id: student.id,
      offer_id: offerId,
    });

    await setStudentSession(student.id);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Registration failed. Please try again.",
    };
  }

  redirect("/dashboard");
}

export async function loginStudentAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0] ?? "local";

  if (!checkRateLimit(`student-login:${ip}`)) {
    return { ok: false, message: "Too many login attempts. Please wait and try again." };
  }

  try {
    const parsed = loginSchema.parse({
      email: formString(formData, "email").toLowerCase(),
      phone: normalizePhone(formString(formData, "phone")),
    });

    const supabase = requireDb();
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("email", parsed.email)
      .eq("phone", parsed.phone)
      .maybeSingle();

    if (!student) {
      return {
        ok: false,
        message: "Invalid login details. Please check your email and phone number.",
      };
    }

    await setStudentSession(student.id);
  } catch {
    return {
      ok: false,
      message: "Invalid login details. Please check your email and phone number.",
    };
  }

  redirect("/dashboard");
}

export async function logoutStudentAction() {
  await clearStudentSession();
  redirect("/login");
}

export async function submitWorkAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const student = await getStudentFromSession();
  if (!student) return { ok: false, message: "Please log in again." };

  try {
    const parsed = submissionSchema.parse({
      taskId: formString(formData, "taskId"),
      githubUrl: formString(formData, "githubUrl"),
      liveUrl: formString(formData, "liveUrl"),
      linkedinUrl: formString(formData, "linkedinUrl"),
      driveUrl: formString(formData, "driveUrl"),
      notes: formString(formData, "notes"),
    });

    const supabase = requireDb();
    const { data: existing } = await supabase
      .from("submissions")
      .select("id,status")
      .eq("student_id", student.id)
      .eq("task_id", parsed.taskId)
      .maybeSingle();

    if (existing && existing.status !== "resubmission_required") {
      return { ok: false, message: "This task is already submitted for review." };
    }

    const payload = {
      student_id: student.id,
      task_id: parsed.taskId,
      github_url: parsed.githubUrl || null,
      live_url: parsed.liveUrl || null,
      linkedin_url: parsed.linkedinUrl || null,
      drive_url: parsed.driveUrl || null,
      notes: parsed.notes || null,
      status: "under_review",
      submitted_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase.from("submissions").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("submissions").insert(payload);
    }

    await supabase.from("students").update({ status: "under_review", updated_at: new Date().toISOString() }).eq("id", student.id);
    revalidatePath("/dashboard");
    return { ok: true, message: "Submission sent for review." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Submission failed." };
  }
}

export async function updateProfileAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const student = await getStudentFromSession();
  if (!student) return { ok: false, message: "Please log in again." };

  try {
    const parsed = profileSchema.parse({
      phone: normalizePhone(formString(formData, "phone")),
      college: formString(formData, "college"),
      degree: formString(formData, "degree"),
      yearOfStudy: formString(formData, "yearOfStudy"),
    });

    await requireDb()
      .from("students")
      .update({
        phone: parsed.phone,
        college: parsed.college,
        degree: parsed.degree,
        year_of_study: parsed.yearOfStudy,
        updated_at: new Date().toISOString(),
      })
      .eq("id", student.id);

    revalidatePath("/dashboard/profile");
    return { ok: true, message: "Profile updated." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Profile update failed." };
  }
}

export async function updateProfileFormAction(formData: FormData) {
  await updateProfileAction({ ok: false, message: "" }, formData);
  revalidatePath("/dashboard/profile");
}

export async function submitSupportAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const student = await getStudentFromSession();
  if (!student) return { ok: false, message: "Please log in again." };

  try {
    const parsed = supportSchema.parse({
      subject: formString(formData, "subject"),
      message: formString(formData, "message"),
    });

    await requireDb().from("support_requests").insert({
      student_id: student.id,
      subject: parsed.subject,
      message: parsed.message,
    });
    return { ok: true, message: "Support request submitted." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Support request failed." };
  }
}

export async function submitSupportFormAction(formData: FormData) {
  await submitSupportAction({ ok: false, message: "" }, formData);
  revalidatePath("/dashboard/help");
}

export async function savePhysicalCertificateAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const student = await getStudentFromSession();
  if (!student) return { ok: false, message: "Please log in again." };

  try {
    const parsed = physicalCertificateSchema.parse({
      fullName: formString(formData, "fullName"),
      phone: normalizePhone(formString(formData, "phone")),
      addressLine1: formString(formData, "addressLine1"),
      addressLine2: formString(formData, "addressLine2"),
      city: formString(formData, "city"),
      state: formString(formData, "state"),
      pincode: formString(formData, "pincode"),
    });

    await requireDb().from("physical_certificate_requests").insert({
      student_id: student.id,
      full_name: parsed.fullName,
      phone: parsed.phone,
      address_line_1: parsed.addressLine1,
      address_line_2: parsed.addressLine2 || null,
      city: parsed.city,
      state: parsed.state,
      pincode: parsed.pincode,
    });

    return { ok: true, message: "Address saved. Ordering will be enabled soon." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not save address." };
  }
}
