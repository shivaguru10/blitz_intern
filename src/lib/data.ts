import { fallbackBatches, fallbackDomains, fallbackTasks } from "@/lib/fallback-data";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase";
import type { Batch, Certificate, Domain, OfferLetter, Student, Submission, Task } from "@/lib/types";

function canUseDb() {
  return hasSupabaseEnv() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function getActiveDomains(): Promise<Domain[]> {
  if (!canUseDb()) return fallbackDomains;
  const { data, error } = await getSupabaseServiceClient()
    .from("domains")
    .select("*")
    .eq("is_active", true)
    .order("name");
  return error || !data ? fallbackDomains : (data as Domain[]);
}

export async function getOpenBatches(): Promise<Batch[]> {
  if (!canUseDb()) return fallbackBatches;
  const { data, error } = await getSupabaseServiceClient()
    .from("batches")
    .select("*")
    .eq("is_active", true)
    .eq("registration_open", true)
    .order("start_date");
  return error || !data ? fallbackBatches : (data as Batch[]);
}

export async function getStudentTasks(student: Student) {
  if (!canUseDb()) return { tasks: fallbackTasks, submissions: [] as Submission[], certificate: null as Certificate | null, offer: null as OfferLetter | null };

  const supabase = getSupabaseServiceClient();
  const [tasksResult, submissionsResult, certificateResult, offerResult] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("is_active", true)
      .or(`domain_id.is.null,domain_id.eq.${student.domain_id}`)
      .order("sort_order"),
    supabase.from("submissions").select("*").eq("student_id", student.id),
    supabase.from("certificates").select("*").eq("student_id", student.id).maybeSingle(),
    supabase.from("offer_letters").select("*").eq("student_id", student.id).maybeSingle(),
  ]);

  return {
    tasks: tasksResult.error || !tasksResult.data ? fallbackTasks : (tasksResult.data as Task[]),
    submissions: submissionsResult.error || !submissionsResult.data ? [] : (submissionsResult.data as Submission[]),
    certificate: certificateResult.error ? null : (certificateResult.data as Certificate | null),
    offer: offerResult.error ? null : (offerResult.data as OfferLetter | null),
  };
}

export async function getAdminSummary() {
  if (!canUseDb()) {
    return {
      students: [] as Student[],
      submissions: [] as (Submission & { students?: Student; tasks?: Task })[],
      domains: fallbackDomains,
      batches: fallbackBatches,
      tasks: fallbackTasks,
      certificates: [] as Certificate[],
    };
  }

  const supabase = getSupabaseServiceClient();
  const [students, submissions, domains, batches, tasks, certificates] = await Promise.all([
    supabase.from("students").select("*, domains(*), batches(*)").order("created_at", { ascending: false }),
    supabase.from("submissions").select("*, students(*), tasks(*)").order("submitted_at", { ascending: false }),
    supabase.from("domains").select("*").order("name"),
    supabase.from("batches").select("*").order("start_date", { ascending: false }),
    supabase.from("tasks").select("*, domains(*), batches(*)").order("sort_order"),
    supabase.from("certificates").select("*"),
  ]);

  return {
    students: students.data ?? [],
    submissions: submissions.data ?? [],
    domains: domains.data ?? fallbackDomains,
    batches: batches.data ?? fallbackBatches,
    tasks: tasks.data ?? fallbackTasks,
    certificates: certificates.data ?? [],
  };
}
