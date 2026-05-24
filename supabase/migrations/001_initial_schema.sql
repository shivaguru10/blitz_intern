create extension if not exists "pgcrypto";

create table if not exists domains (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  duration text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date,
  end_date date,
  is_active boolean default true,
  registration_open boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  college text,
  degree text,
  year_of_study text,
  domain_id uuid references domains(id),
  batch_id uuid references batches(id),
  intern_id text unique not null,
  status text not null default 'registered',
  session_token_hash text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint students_email_unique unique (email),
  constraint students_phone_unique unique (phone)
);

create table if not exists admins (
  id uuid primary key references auth.users(id),
  full_name text,
  email text unique not null,
  role text default 'admin',
  created_at timestamp with time zone default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid references domains(id),
  batch_id uuid references batches(id),
  title text not null,
  description text,
  requirements text,
  key_features text[],
  expected_outcome text,
  resources text,
  deadline date,
  sort_order integer default 0,
  is_mandatory boolean default false,
  is_final_task boolean default false,
  is_active boolean default true,
  is_locked boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  task_id uuid references tasks(id) on delete cascade,
  github_url text,
  live_url text,
  linkedin_url text,
  drive_url text,
  notes text,
  file_url text,
  status text check (status in ('submitted','under_review','approved','resubmission_required','rejected')) default 'submitted',
  admin_feedback text,
  submitted_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  unique (student_id, task_id)
);

create table if not exists offer_letters (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  offer_id text unique not null,
  issue_date date default current_date,
  pdf_url text,
  created_at timestamp with time zone default now()
);

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade unique,
  certificate_id text unique not null,
  issue_date date,
  pdf_url text,
  verification_enabled boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists support_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  subject text,
  message text,
  status text default 'open',
  created_at timestamp with time zone default now()
);

create table if not exists physical_certificate_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  full_name text,
  phone text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  pincode text,
  status text default 'not_enabled',
  payment_status text default 'pending',
  created_at timestamp with time zone default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text,
  entity_type text,
  entity_id text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(select 1 from admins where id = auth.uid());
$$;

create or replace function verify_blitz_certificate(search_query text)
returns table (
  full_name text,
  intern_id text,
  domain_name text,
  duration text,
  certificate_id text,
  issue_date date
)
language sql
security definer
set search_path = public
as $$
  select
    s.full_name,
    s.intern_id,
    d.name as domain_name,
    coalesce(d.duration, '') as duration,
    c.certificate_id,
    c.issue_date
  from certificates c
  join students s on s.id = c.student_id
  left join domains d on d.id = s.domain_id
  where c.verification_enabled = true
    and (c.certificate_id = search_query or s.intern_id = search_query)
  limit 1;
$$;

alter table domains enable row level security;
alter table batches enable row level security;
alter table students enable row level security;
alter table admins enable row level security;
alter table tasks enable row level security;
alter table submissions enable row level security;
alter table offer_letters enable row level security;
alter table certificates enable row level security;
alter table support_requests enable row level security;
alter table physical_certificate_requests enable row level security;
alter table audit_logs enable row level security;

create policy "Admins manage domains" on domains for all using (is_admin()) with check (is_admin());
create policy "Public read active domains" on domains for select using (is_active = true);

create policy "Admins manage batches" on batches for all using (is_admin()) with check (is_admin());
create policy "Public read open batches" on batches for select using (is_active = true and registration_open = true);

create policy "Admins manage students" on students for all using (is_admin()) with check (is_admin());
create policy "Admins manage tasks" on tasks for all using (is_admin()) with check (is_admin());
create policy "Public read active tasks" on tasks for select using (is_active = true);
create policy "Admins manage submissions" on submissions for all using (is_admin()) with check (is_admin());
create policy "Admins manage offers" on offer_letters for all using (is_admin()) with check (is_admin());
create policy "Admins manage certificates" on certificates for all using (is_admin()) with check (is_admin());
create policy "Admins manage support" on support_requests for all using (is_admin()) with check (is_admin());
create policy "Admins manage physical requests" on physical_certificate_requests for all using (is_admin()) with check (is_admin());
create policy "Admins manage audit logs" on audit_logs for all using (is_admin()) with check (is_admin());
create policy "Admins read admins" on admins for select using (is_admin());
