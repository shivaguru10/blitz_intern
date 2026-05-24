"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseAnonClient, getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

const ADMIN_COOKIE = "blitz_admin_access";

export async function getAdminUser() {
  if (!hasSupabaseEnv()) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const supabase = getSupabaseAnonClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  const { data: admin } = await getSupabaseServiceClient()
    .from("admins")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  return admin ? data.user : null;
}

export async function adminLoginAction(_: { ok: boolean; message: string }, formData: FormData) {
  try {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const supabase = getSupabaseAnonClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      return { ok: false, message: "Invalid admin credentials." };
    }

    const { data: admin } = await getSupabaseServiceClient()
      .from("admins")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!admin) {
      return { ok: false, message: "This account is not authorized as an admin." };
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, data.session.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: data.session.expires_in,
    });
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Admin login failed." };
  }

  redirect("/admin");
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function updateStudentStatusAction(formData: FormData) {
  if (!(await getAdminUser())) redirect("/admin/login");
  const id = String(formData.get("studentId"));
  const status = String(formData.get("status"));
  await getSupabaseServiceClient().from("students").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/students");
  revalidatePath("/admin");
}

export async function generateCertificateAction(formData: FormData) {
  if (!(await getAdminUser())) redirect("/admin/login");
  const studentId = String(formData.get("studentId"));
  const year = new Date().getFullYear();
  const serial = studentId.slice(0, 6).toUpperCase();
  const certificateId = `BLITZ-CERT-${year}-${serial}`;
  const supabase = getSupabaseServiceClient();

  await supabase.from("certificates").upsert(
    {
      student_id: studentId,
      certificate_id: certificateId,
      issue_date: new Date().toISOString().slice(0, 10),
      verification_enabled: true,
    },
    { onConflict: "student_id" },
  );
  await supabase.from("students").update({ status: "certificate_issued" }).eq("id", studentId);
  revalidatePath("/admin/students");
}

export async function reviewSubmissionAction(formData: FormData) {
  if (!(await getAdminUser())) redirect("/admin/login");
  const submissionId = String(formData.get("submissionId"));
  const status = String(formData.get("status"));
  const feedback = String(formData.get("feedback") ?? "");
  await getSupabaseServiceClient()
    .from("submissions")
    .update({ status, admin_feedback: feedback || null, reviewed_at: new Date().toISOString() })
    .eq("id", submissionId);
  revalidatePath("/admin/submissions");
}

export async function createDomainAction(formData: FormData) {
  if (!(await getAdminUser())) redirect("/admin/login");
  const name = String(formData.get("name") ?? "").trim();
  await getSupabaseServiceClient().from("domains").insert({
    name,
    slug: slugify(String(formData.get("slug") || name)),
    description: String(formData.get("description") ?? ""),
    duration: String(formData.get("duration") ?? ""),
    is_active: formData.get("isActive") === "on",
  });
  revalidatePath("/admin/domains");
}

export async function createBatchAction(formData: FormData) {
  if (!(await getAdminUser())) redirect("/admin/login");
  await getSupabaseServiceClient().from("batches").insert({
    name: String(formData.get("name") ?? ""),
    start_date: String(formData.get("startDate") || null),
    end_date: String(formData.get("endDate") || null),
    is_active: formData.get("isActive") === "on",
    registration_open: formData.get("registrationOpen") === "on",
  });
  revalidatePath("/admin/batches");
}

export async function createTaskAction(formData: FormData) {
  if (!(await getAdminUser())) redirect("/admin/login");
  await getSupabaseServiceClient().from("tasks").insert({
    title: String(formData.get("title") ?? ""),
    domain_id: String(formData.get("domainId") || "") || null,
    batch_id: String(formData.get("batchId") || "") || null,
    description: String(formData.get("description") ?? ""),
    requirements: String(formData.get("requirements") ?? ""),
    resources: String(formData.get("resources") ?? ""),
    deadline: String(formData.get("deadline") || "") || null,
    key_features: String(formData.get("keyFeatures") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    expected_outcome: String(formData.get("expectedOutcome") ?? ""),
    is_active: formData.get("isActive") === "on",
    is_locked: formData.get("isLocked") === "on",
  });
  revalidatePath("/admin/tasks");
}
