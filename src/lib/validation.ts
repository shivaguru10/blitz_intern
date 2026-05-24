import { z } from "zod";

const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number"),
  college: z.string().min(2, "College name is required").max(180),
  degree: z.string().min(2, "Degree is required").max(120),
  yearOfStudy: z.string().min(1, "Year of study is required").max(60),
  domainId: z.string().uuid("Choose an internship domain"),
  batchId: z.string().uuid("Choose a batch"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Please accept the terms" }),
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number"),
});

export const submissionSchema = z.object({
  taskId: z.string().uuid(),
  githubUrl: z.string().url("Enter a valid GitHub URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Enter a valid live URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Enter a valid LinkedIn URL").optional().or(z.literal("")),
  driveUrl: z.string().url("Enter a valid file URL").optional().or(z.literal("")),
  notes: z.string().max(1000).optional(),
});

export const profileSchema = z.object({
  phone: z.string().regex(phoneRegex, "Enter a valid phone number"),
  college: z.string().min(2).max(180),
  degree: z.string().min(2).max(120),
  yearOfStudy: z.string().min(1).max(60),
});

export const supportSchema = z.object({
  subject: z.string().min(4).max(160),
  message: z.string().min(10).max(1500),
});

export const physicalCertificateSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().regex(phoneRegex),
  addressLine1: z.string().min(4).max(220),
  addressLine2: z.string().max(220).optional(),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  pincode: z.string().min(4).max(12),
});
