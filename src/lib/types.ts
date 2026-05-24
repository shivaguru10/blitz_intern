export type StudentStatus =
  | "registered"
  | "offer_issued"
  | "tasks_assigned"
  | "submitted"
  | "under_review"
  | "approved"
  | "certificate_issued";

export type SubmissionStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "resubmission_required"
  | "rejected";

export type Domain = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  duration: string | null;
  is_active: boolean;
};

export type Batch = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  registration_open: boolean;
};

export type Student = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  college: string | null;
  degree: string | null;
  year_of_study: string | null;
  domain_id: string | null;
  batch_id: string | null;
  intern_id: string;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
  domains?: Domain | null;
  batches?: Batch | null;
};

export type Task = {
  id: string;
  domain_id: string | null;
  batch_id: string | null;
  title: string;
  description: string | null;
  requirements: string | null;
  key_features: string[] | null;
  expected_outcome: string | null;
  resources: string | null;
  deadline: string | null;
  sort_order: number;
  is_mandatory: boolean;
  is_final_task: boolean;
  is_active: boolean;
  is_locked: boolean;
};

export type Submission = {
  id: string;
  student_id: string;
  task_id: string;
  github_url: string | null;
  live_url: string | null;
  linkedin_url: string | null;
  drive_url: string | null;
  notes: string | null;
  file_url: string | null;
  status: SubmissionStatus;
  admin_feedback: string | null;
  submitted_at: string;
  reviewed_at: string | null;
};

export type Certificate = {
  id: string;
  student_id: string;
  certificate_id: string;
  issue_date: string | null;
  pdf_url: string | null;
  verification_enabled: boolean;
};

export type OfferLetter = {
  id: string;
  student_id: string;
  offer_id: string;
  issue_date: string;
  pdf_url: string | null;
};
