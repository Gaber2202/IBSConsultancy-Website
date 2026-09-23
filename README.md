# IBS Consultancy — Website

A bilingual (English / Arabic) marketing website for **IBS Consultancy**, a UAE business‑setup advisory firm, built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

It includes:

- 🌐 **Bilingual EN/AR** with full RTL support and `hreflang` alternates
- 🎨 A new, premium **navy + gold** design system (not the old WordPress template)
- 📈 **SEO built in**: per‑page metadata, JSON‑LD schema (Organization, Service, Breadcrumb, Article), `sitemap.xml`, `robots.txt`, canonical + hreflang, dynamic OG image
- 📝 A conversion‑focused **lead‑capture form** with validation, spam honeypot, and an API
- 🔐 A password‑protected **admin dashboard** (`/admin`) to view, filter, update, export, and delete leads
- ⚡ Fast, accessible, responsive, animated on scroll

---

## 1. Quick start (local)

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.local.example .env.local
#    then edit .env.local (see section 3)

# 3. Run the dev server
npm run dev
# → http://localhost:3000  (redirects to /en)

# Production build + run
npm run build
npm run start
```

Requirements: **Node.js 18.17+ (Node 20/22 recommended)**.

---

## 2. Key URLs

| URL | What it is |
|-----|------------|
| `/` | Redirects to `/en` or `/ar` based on the browser language |
| `/en`, `/ar` | Home |
| `/en/about`, `/en/services`, `/en/blog`, `/en/contact` | Marketing pages (and `/ar/...`) |
| `/en/blog/<slug>` | Blog articles |
| `/admin/login` | Admin sign‑in |
| `/admin` | Lead dashboard (protected) |
| `/api/leads` | `POST` new lead (public) · `GET` list (protected) |
| `/api/leads/export` | Download all leads as CSV (protected) |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | SEO / PWA |

---

## 3. Environment variables

Set these in `.env.local` (local) and in your Vercel project settings (production).

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical base URL, e.g. `https://ibsconsultancy.ae` (no trailing slash) |
| `NEXT_PUBLIC_PHONE` | ✅ | Phone number shown on the site |
| `NEXT_PUBLIC_WHATSAPP` | ✅ | WhatsApp number, digits only (e.g. `971500000000`) |
| `NEXT_PUBLIC_EMAIL` | ✅ | Contact email |
| `ADMIN_USERNAME` | ✅ | Admin dashboard username |
| `ADMIN_PASSWORD` | ✅ | Admin dashboard password (use a strong one) |
| `AUTH_SECRET` | ✅ | Long random string used to sign the session cookie (32+ chars) |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | optional | Enable durable lead storage via Vercel KV (see §5) |
| `LEAD_WEBHOOK_URL` | optional | Every new lead is also POSTed here (Zapier/Make/Slack/CRM) |

> ⚠️ Change `ADMIN_PASSWORD` and `AUTH_SECRET` before going live.

---

## 4. Deploy to Vercel

1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. In Vercel: **New Project → Import** the repo. Framework preset is auto‑detected as **Next.js**.
3. Add the environment variables from §3 under **Settings → Environment Variables**.
4. Deploy. Point the `ibsconsultancy.ae` domain at the project under **Settings → Domains**.

No extra build configuration is needed. Google Fonts load at runtime, so builds work in any environment.

---

## 5. Lead storage — how it works

Leads are saved through a small storage abstraction in `src/lib/leads.ts`:

- **Default (no config):** written to a JSON file — `data/leads.json` locally, or `/tmp/leads.json` on serverless. This works out of the box and is great for local dev and demos. **On Vercel, `/tmp` is ephemeral** (leads can be lost between deployments / cold starts), so for production do one of the following:
- **Recommended — Vercel KV:** In Vercel, add a **KV** store to the project (Storage tab). It injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically; the app detects them and switches to KV — no code change needed. Leads then persist durably.
- **Or a webhook:** set `LEAD_WEBHOOK_URL` to forward every lead to your CRM, email, or a Google Sheet via Zapier/Make. This works alongside either storage option.
- **Or a database:** replace the `fileStore`/`kv` functions in `src/lib/leads.ts` with a Postgres/Supabase adapter (the interface is `getLeads`, `addLead`, `updateLeadStatus`, `deleteLead`).

---

## 6. Editing content

All site copy lives in two JSON dictionaries — **no code editing required**:

- `src/i18n/dictionaries/en.json` — English
- `src/i18n/dictionaries/ar.json` — Arabic

Both files share the **same keys**. Edit services, stats, testimonials, blog posts, contact details, and SEO titles/descriptions there. To add a blog post, add an entry to `blog.posts` in **both** files (same `slug`).

Company contact details also come from the `NEXT_PUBLIC_*` env vars (§3).

---

## 7. Logo

The site currently uses a clean SVG monogram generated to match IBS's navy + gold identity:

- `src/components/Logo.tsx` — the header/footer logo (inline SVG, crisp at any size)
- `public/logo.svg` — used for favicon / OG / manifest

**To use your original logo image:** drop your file into `public/` (e.g. `public/logo.png`) and replace the `<LogoMark>` SVG in `src/components/Logo.tsx` with an `<Image src="/logo.png" ... />`. Update `public/logo.svg` reference in the manifest/metadata if you want a raster favicon.

---

## 8. Design system

- **Colours:** deep ink navy (`ink`) + refined gold (`gold`) — defined in `tailwind.config.ts`.
- **Fonts:** Fraunces (display serif), Inter (Latin body), IBM Plex Sans Arabic (Arabic) — loaded via Google Fonts.
- **Components:** all in `src/components/`. Sections (`Hero`, `Stats`, `ServicesGrid`, `WhyUs`, `Process`, `Testimonials`, `CTASection`) are reused across pages.

---

## 9. Project structure

```
src/
  app/
    [locale]/            # Bilingual marketing site (en, ar)
      layout.tsx         # <html> root, fonts, header/footer, RTL
      page.tsx           # Home
      about/ services/ contact/ blog/ blog/[slug]/
    admin/               # Protected dashboard (own layout)
      login/  page.tsx  LeadsTable.tsx  LogoutButton.tsx
    api/
      leads/             # POST (public), GET (protected), [id], export
      auth/login  auth/logout
    sitemap.ts  robots.ts  manifest.ts  opengraph-image.tsx
  components/            # UI + section components
  i18n/                  # locale config + EN/AR dictionaries
  lib/                   # leads store, auth, site helpers, JSON-LD schema
  middleware.ts          # locale detection & redirects
```

---

## 10. Admin dashboard

- Sign in at **`/admin/login`** with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
- Session is an httpOnly, HMAC‑signed cookie (8‑hour expiry), verified in the server components and API routes.
- Features: stat cards, status pipeline (new → contacted → qualified → won/lost), search, filter, per‑lead delete, and **Export CSV**.
- `/admin` and `/api` are excluded from indexing (`robots.txt` + `noindex`).

---

### What changed vs. the old site
Fixed the placeholder stats and fake testimonials, the broken `/services/contact/` link, and the thin SEO — and added the Arabic version, a working lead pipeline, and the admin dashboard the old WordPress site didn't have.
