# Youth Policy Lab — website

Next.js 16 (App Router, TypeScript) site for Youth Policy Lab. It includes an open-access research library, the Mini Gurgaon Policy Briefs series, a recruitment portal with three application pathways, a contact form, site-wide search, an AI assistant, and a password-protected admin dashboard.

- **Content and storage:** Supabase (Postgres + Storage), accessed **only from the server**.
- **AI assistant:** Claude API (`@anthropic-ai/sdk`), called server-side and grounded in the site's own content.
- **Styling:** a single hand-written design system in `app/globals.css` (no CSS framework).

---

## 1. Run locally

```bash
npm install
cp .env.example .env.local   # then fill in values (see §2)
npm run dev                  # http://localhost:3000
```

Production: `npm run build && npm start`. You can deploy to any Node host (Vercel, Netlify, Render, a VPS). Set the same environment variables in the host's dashboard.

The site builds and runs with **no** environment variables set. Pages render with empty states. Forms return a clear "not connected" error and save nothing, and the assistant shows "awaiting configuration". Nothing pretends to work when it doesn't.

## 2. Environment variables

| Variable | Needed for | Where to get it |
|---|---|---|
| `SITE_URL` | Canonical links, sitemap, citations | Your production URL, e.g. `https://youthpolicylab.org` |
| `SUPABASE_URL` | Forms, admin, CMS content, PDF uploads | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Same | Same page ("service_role" secret). **Server only, never expose it.** |
| `SUPABASE_STORAGE_BUCKET` | PDF and image uploads | Defaults to `publications` |
| `ADMIN_PASSWORD` | Owner sign-in to `/admin` (full access) | A strong password, kept by one or two people |
| `ADMIN_SESSION_SECRET` | Signing admin sessions, hashing rate-limit keys | `openssl rand -base64 48` (minimum 32 characters) |
| `RESEND_API_KEY`, `NOTIFY_FROM`, `NOTIFY_EMAIL` | Optional email alerts for new applications and messages | https://resend.com (verify your sending domain first) |
| `NOTIFY_SEND_CONFIRMATION` | Optional "we received your application" email to applicants | `true` or `false` |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Optional captcha on all forms | Cloudflare dashboard → Turnstile → Add site. Redeploy after setting. |
| `ANTHROPIC_API_KEY` | AI assistant | https://console.anthropic.com → API keys |
| `ANTHROPIC_MODEL` | Optional override | Defaults to `claude-opus-5-5` |

None of these use the `NEXT_PUBLIC_` prefix, so none of them reach the browser.

## 3. Set up Supabase (about 5 minutes)

1. Create a free project at https://supabase.com.
2. Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql` and click **Run**. This creates:
   - the tables `publications`, `team_members`, `initiatives`, `applications` and `contact_messages`
   - row-level security on every table with **no public policies**, so the public "anon" key can read or write nothing. Applications are never exposed.
   - a public-read storage bucket `publications` for PDFs and images. Uploads only happen through signed URLs the server creates for signed-in admins.
3. Copy the project URL and service-role key into your environment variables and restart the site.
4. Go to `/admin` and sign in with `ADMIN_PASSWORD`. The Overview page shows what is configured.

## 4. Adding content

There are two ways to add content, and you can use both at once. If the same slug exists in both places, the database version wins.

### A. Admin dashboard (recommended, no code)
Go to `/admin`:
- **Publications & briefs:** create a paper, report or brief, fill in the abstract, findings and recommendations, and click **Upload PDF**. The file goes straight to Supabase Storage. Set *Visibility* to **Published** and save. The new page appears at `/research/<slug>`, or at `/gurgaon-briefs/<slug>` for type *Mini Gurgaon Policy Brief*. Choose that type and an issue number to add a brief to the series.
- **Initiatives & events:** title, kind, status (upcoming / ongoing / completed), dates, registration link, related publication slugs, and outcomes once completed.
- **Team & advisors:** name, role, section (leadership, board, department heads, research, advisors), bio, expertise, photo, LinkedIn link, sort order and visibility.

The public pages refresh immediately after each save.

### B. JSON files (version-controlled)
Edit `content/publications.json`, `content/team.json` or `content/initiatives.json`, then redeploy. Copy-and-edit templates are in `content/examples/`. Put PDFs in `public/files/publications/` and reference them as `/files/publications/name.pdf`. See `docs/CONTENT.md`.

Site-wide settings live in `lib/site.ts`: contact email, social links, navigation, focus areas and Gurgaon topics. About-page copy is in `lib/org.ts` and recruitment pathway copy in `lib/pathways.ts`. The AI assistant reads all of these as well.

## 5. Admin accounts and roles

Sign in to `/admin` with **no email** and the `ADMIN_PASSWORD` to use the owner account. Then go to **Admin accounts** and create a personal login for each person:

| Role | Can access |
|---|---|
| Reviewer | Applications, contact messages |
| Editor | Publications and briefs, initiatives, team profiles, contact messages |
| Admin | Everything, including admin accounts |

People sign in with their email and the temporary password you give them, then change it under **My account**. Passwords are hashed with scrypt. Deactivating an account or changing its role takes effect on that person's next click. Keep the owner password for emergencies only.

## 6. Reviewing applications

`/admin/applications` lists every Team, Board and Advisor application. You can filter by pathway and status. Open an application to read the full answers, set a status (new → reviewing → shortlisted → accepted / declined / archived), add internal notes, or permanently delete it (for example when an applicant asks). Contact-form messages are under `/admin/messages`.

Security:
- Sessions are HMAC-signed, httpOnly, SameSite=strict cookies lasting 8 hours. Login attempts are rate-limited, and each page checks the user's role.
- Every admin page and server action re-checks the session.
- `/admin` and `/api` are excluded in `robots.txt` and marked `noindex`.

You can also view the raw data in the Supabase table editor.

## 7. How the forms work

- Field definitions live in `lib/forms.ts`. The same rules validate in the browser and again on the server, and unknown fields are stripped.
- Spam protection: a hidden honeypot field, a minimum fill time, a same-origin check, an optional Cloudflare Turnstile captcha, and a rate limit of 5 submissions per hour per form. The rate limit is stored in the database, so it holds across all server instances, and it stores only a one-way hash of the network address.
- Notifications (optional): the team inbox gets an email with the applicant's name, the pathway and a link to the admin page. Answers are never included in the email. Contact messages are forwarded in full, with reply-to set to the sender. If email fails, the submission is still saved.
- Privacy: applicants give an age range only, not a date of birth, and there is no address field. Applicants under 18 must confirm a parent or guardian is aware. Consent to the privacy notice is required.
- The site shows "Application received" only after Supabase confirms the insert.

## 8. The AI assistant

`app/api/chat/route.ts` builds a knowledge base on each request from the About copy, the published publications (abstracts, findings and recommendations), initiatives, team profiles and recruitment pathways (`lib/knowledge.ts`). It sends that to Claude with instructions to answer **only** from that content, to never invent publications, people or positions, and to say when it doesn't know. Replies stream to the floating widget on every page. The widget shows a disclaimer that answers are AI-generated.

Without `ANTHROPIC_API_KEY`, the widget clearly says it is awaiting configuration and points to the main pages. It never fakes answers. Requests are limited to 20 per IP per 10 minutes.

## 9. Project structure

```
app/(site)/        public pages (home, about, research, gurgaon-briefs, initiatives, team, get-involved, contact, privacy, disclaimer, search)
app/admin/         login, dashboard and server actions (protected)
app/api/           chat, search, form submission
components/        Header, Footer, cards, forms, chat widget, search dialog, admin helpers
content/           JSON content and templates
lib/               content loading, search, forms, site config, org copy, auth, Supabase client
supabase/schema.sql
```

## 10. Deploying (Vercel, recommended)

1. Push this repository to GitHub.
2. At https://vercel.com/new, import the repository. The framework is detected as Next.js automatically.
3. Under **Settings → Environment Variables**, add the variables from §2 and set `SITE_URL` to your final domain. Then deploy.
4. Run `supabase/schema.sql` in Supabase. Re-running it is safe; this is also how you apply updates.
5. Add your custom domain under **Settings → Domains**.
6. Sign in at `/admin`, create personal accounts, and add your contact email and social links in `lib/site.ts`.

Each push to `main` redeploys the site. CI (`.github/workflows/ci.yml`) type-checks and builds every push and pull request.

## 11. Known limitations

- The Turnstile captcha could not be tested against Cloudflare's live servers during development. Missing or failed checks are rejected, but test one real submission after enabling it.
- Email delivery depends on a verified Resend domain. Send a test application after setup.
- The site contains no photography. Add real images (team photos, publication covers) through the admin dashboard.
