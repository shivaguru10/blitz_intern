# Blitz Solutions Virtual Internship Platform

Production-ready MVP for the **Blitz Solutions Virtual Internship Program** (`Blitz VIP`). It includes passwordless student registration/login, custom secure student sessions, Supabase-backed admin management, task submissions, public certificate verification, and PDF generation for offer letters, certificates, and ID cards.

## Tech Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS
- shadcn-style reusable UI primitives, Lucide React icons
- Supabase Postgres, Storage-ready schema, Supabase Auth for admins
- React Hook Form + Zod validation
- Server Actions for mutations
- jsPDF PDF generation

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
STUDENT_SESSION_SECRET=replace-with-a-long-random-secret
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `STUDENT_SESSION_SECRET` in the browser.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL editor or through the Supabase CLI.
3. Run `supabase/seed/seed.sql` to create domains, batches, mandatory task, domain tasks, Cyber Security tasks, and final locked task.
4. Fill `.env.local`.

## Create the First Admin

1. In Supabase Auth, create a user with email/password.
2. Copy the Auth user UUID.
3. Insert a row into `admins`:

```sql
insert into admins (id, full_name, email, role)
values ('AUTH_USER_UUID_HERE', 'Admin Name', 'admin@example.com', 'admin');
```

Admin login at `/admin/login` uses Supabase Auth email/password. Only users present in `admins` can access admin routes.

## Student Login Without Passwords

Students register with name, email, phone, college, degree, year, domain, batch, and terms acceptance. The app generates:

- Intern ID: `BLITZ-VIP-2026-000001`
- Offer ID: `BLITZ-OFFER-2026-000001`

Student login verifies the email and phone pair and creates a signed HTTP-only cookie. The session token hash is stored on the student record. Login errors use the required generic message.

## Key Routes

- `/` landing page
- `/register` student registration
- `/login` passwordless student login
- `/verify` public certificate verification
- `/dashboard` student task dashboard
- `/dashboard/id-card`
- `/dashboard/physical-certificate`
- `/dashboard/profile`
- `/dashboard/help`
- `/admin/login`
- `/admin`
- `/admin/students`
- `/admin/tasks`
- `/admin/submissions`
- `/admin/domains`
- `/admin/batches`
- `/terms`, `/privacy`, `/fee-policy`

## Validation Commands

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

## Deploy on Vercel

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add the environment variables above.
4. Set `NEXT_PUBLIC_APP_URL` to your production URL.
5. Deploy.

## Known MVP Limitations

- Optional file upload is represented as a file input plus Drive/file URL; Supabase Storage upload can be added next.
- Physical certificate payment is intentionally a placeholder.
- The ID card uses a QR placeholder; a real QR renderer can replace it.
- Certificate generation is admin-triggered after review, but deeper task completion rules can be tightened for production.
