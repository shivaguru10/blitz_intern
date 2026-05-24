import { cookies } from "next/headers";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase";
import type { Student } from "@/lib/types";

const COOKIE_NAME = "blitz_student_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  return process.env.STUDENT_SESSION_SECRET || "dev-only-change-me";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken(studentId: string) {
  const raw = `${studentId}.${randomBytes(32).toString("base64url")}`;
  return `${raw}.${sign(raw)}`;
}

function verifySignedToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  const actual = parts[2];
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);
  if (expectedBuffer.length !== actualBuffer.length) return null;
  if (!timingSafeEqual(expectedBuffer, actualBuffer)) return null;
  return { studentId: parts[0], token };
}

export async function setStudentSession(studentId: string) {
  const token = createSessionToken(studentId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  const supabase = getSupabaseServiceClient();
  await supabase
    .from("students")
    .update({ session_token_hash: hashToken(token), updated_at: new Date().toISOString() })
    .eq("id", studentId);
}

export async function clearStudentSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getStudentFromSession(): Promise<Student | null> {
  if (!hasSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const verified = verifySignedToken(token);
  if (!verified) return null;

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("students")
    .select("*, domains(*), batches(*)")
    .eq("id", verified.studentId)
    .eq("session_token_hash", hashToken(verified.token))
    .maybeSingle();

  if (error || !data) return null;
  return data as Student;
}
