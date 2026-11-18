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
| `ADMIN_PASSWORD` | `/admin` sign-in | Choose a strong password and share it only with reviewers |
| `ADMIN_SESSION_SECRET` | Signing admin sessions | `openssl rand -base64 48` (minimum 32 characters) |
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

## 5. Reviewing applications

`/admin/applications` lists every Team, Board and Advisor application. You can filter by pathway and status. Open an application to read the full answers, set a status (new → reviewing → shortlisted → accepted / declined / archived), add internal notes, or permanently delete it (for example when an applicant asks). Contact-form messages are under `/admin/messages`.

Security:
- `/admin` requires the shared password. Sessions are HMAC-signed, httpOnly, SameSite=strict cookies lasting 8 hours, and login attempts are rate-limited.
- Every admin page and server action re-checks the session.
- `/admin` and `/api` are excluded in `robots.txt` and marked `noindex`.

You can also view the raw data in the Supabase table editor.

## 6. How the forms work

- Field definitions live in `lib/forms.ts`. The same rules validate in the browser and again on the server, and unknown fields are stripped.
- Spam protection: a hidden honeypot field, a minimum fill time, a same-origin check, and a per-IP rate limit (5 submissions per hour per form).
- Privacy: applicants give an age range only, not a date of birth, and there is no address field. Applicants under 18 must confirm a parent or guardian is aware. Consent to the privacy notice is required.
- The site shows "Application received" only after Supabase confirms the insert.

## 7. The AI assistant

`app/api/chat/route.ts` builds a knowledge base on each request from the About copy, the published publications (abstracts, findings and recommendations), initiatives, team profiles and recruitment pathways (`lib/knowledge.ts`). It sends that to Claude with instructions to answer **only** from that content, to never invent publications, people or positions, and to say when it doesn't know. Replies stream to the floating widget on every page. The widget shows a disclaimer that answers are AI-generated.

Without `ANTHROPIC_API_KEY`, the widget clearly says it is awaiting configuration and points to the main pages. It never fakes answers. Requests are limited to 20 per IP per 10 minutes.

## 8. Project structure

```
app/(site)/        public pages (home, about, research, gurgaon-briefs, initiatives, team, get-involved, contact, privacy, disclaimer, search)
app/admin/         login, dashboard and server actions (protected)
app/api/           chat, search, form submission
components/        Header, Footer, cards, forms, chat widget, search dialog, admin helpers
content/           JSON content and templates
lib/               content loading, search, forms, site config, org copy, auth, Supabase client
supabase/schema.sql
```

## 9. Known limitations

- The in-memory rate limits are per server instance. On serverless hosts they act as soft limits. For stronger protection, add Cloudflare Turnstile or hCaptcha to the forms.
- There is one shared admin password. For individual reviewer accounts, replace `lib/admin-auth.ts` with Supabase Auth.
- No email notification on new applications yet. You can add a Supabase Database Webhook or a Resend call in `app/api/submit/[form]/route.ts`.
