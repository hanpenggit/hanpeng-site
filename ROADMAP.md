# Roadmap — from zero to live at sahilsapra.com

**For:** Sahil
**Last updated:** 2026-06-22

This is the recommended path. Order matters: design the look first so Claude Code builds against a real target, not a guess.

---

## Phase 0 — Accounts & domain (≈30 min, do once)

1. **Buy the domain.** Register `sahilsapra.com`. Cloudflare Registrar or Namecheap are both fine (Cloudflare sells at cost). You'll point DNS at Vercel in Phase 5 — you do **not** need Vercel's own registrar.
2. **GitHub:** confirm your account and pick the repo name (suggestion: `sahilsapra-website` or `portfolio`). Keep it **public**.
3. **Vercel:** sign up / log in with GitHub.
4. **OpenRouter:** create an API key for the chatbot at openrouter.ai/keys. Add a little credit and set a **spend limit** — cheap insurance for a public site. One key gives you any model; you'll pick the model slug later via an env var.
5. **Upstash:** create a free Redis database for chatbot rate limiting; copy the REST URL + token.
6. **Vercel Web Analytics:** you'll flip this on in the Vercel dashboard after the first deploy (Phase 5) — no account needed, it's built in.

> Keep the OpenRouter key and Upstash token in a password manager for now. They go into Vercel env vars later — never into the repo.

---

## Phase 1 — Design the look (Claude Design)

Hand Claude Design the **`DESIGN_BRIEF.md`** (and `content/profile.json` for real copy). Ask it to produce:
- a confirmed design plan / token system,
- wireframes for hero (mid-boot + resolved), work (both toggle states), projects (collapsed + expanded), stack, and the chat panel — dark **and** light,
- a component spec sheet,
- final CSS-variable tokens.

**Output of this phase:** wireframe screens + a `globals.css` token block. That's the target Claude Code builds to.

> Why design first: the boot-sequence signature and the metric-pill system are visual decisions. Locking them before coding avoids rebuilds.

---

## Phase 2 — Scaffold & build (Claude Code)

Open Claude Code in an empty folder and give it, in this order:
1. `PRD.md` — what to build and why.
2. `TECHNICAL_SPEC.md` — stack, structure, the chatbot route, security rules.
3. `DESIGN_BRIEF.md` + Phase-1 tokens — how it should look.
4. `content/profile.json` — the actual content. Drop it at `content/profile.json`.

Suggested first prompt to Claude Code:
> "Scaffold a Next.js 15 + TypeScript + Tailwind v4 project per TECHNICAL_SPEC.md. Set up the theme, fonts, and the CSS-variable tokens from DESIGN_BRIEF.md. Wire `content/profile.json` through `lib/profile.ts` with full TS types. Then build the static sections in this order: Hero, Work, Projects, Stack, Footer — all reading from profile.json, nothing hard-coded. Stop after the static build so I can review before we add animation and the chatbot."

Then iterate: animation → chatbot → SEO/OG → CI → polish. Follow §9 "Build order" in `TECHNICAL_SPEC.md`.

**Drop your resume PDF** into `public/Sahil_Sapra_Resume.pdf` and your headshot into `public/` so the Resume button and hero photo work.

---

## Phase 3 — Wire the chatbot

1. Locally, create `.env.local` from `.env.example` and paste your real `OPENROUTER_API_KEY` (and optional `OPENROUTER_MODEL`) + Upstash vars.
2. `pnpm dev`, open the chat panel, test: ask about SpecHawk, the migration, a skill, "how do I reach Sahil?" (should offer the calendar link), and one off-topic question (should decline and point to LinkedIn).
3. Confirm streaming works and the suggested-question chips prefill.
4. Confirm the rate limit triggers (temporarily lower it to test, then restore).
5. Confirm the **Resume** button opens the PDF in a new tab and the **Schedule a call** button opens the Google Calendar page in a new tab.

---

## Phase 4 — Repo hygiene (this is your first flagship public repo)

Before the first public push, verify:
- [ ] `.gitignore` excludes `.env*` (but **commits** `.env.example`).
- [ ] No key string anywhere in tracked files: `git grep -iE "sk-or-|sk-ant-"` returns nothing.
- [ ] `LICENSE` (MIT) present.
- [ ] `README.md` is polished (see the README in this package) — screenshot/GIF, live link, stack, local-setup, "edit profile.json to update," deploy notes.
- [ ] GitHub Actions CI is green (typecheck + lint + build).
- [ ] Repo description + topics set; pin it on your profile.

Then push.

---

## Phase 5 — Deploy to Vercel + custom domain

1. Vercel → **Add New Project** → import the GitHub repo. Framework auto-detects Next.js.
2. **Environment Variables** (Production + Preview): `OPENROUTER_API_KEY`, optional `OPENROUTER_MODEL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Deploy.
3. **Enable Web Analytics:** Vercel project → **Analytics** tab → enable. Page views start immediately; your custom button events show up once traffic flows.
4. You'll get a `*.vercel.app` URL — test everything there, including the chatbot (env vars are live now).
5. **Custom domain:** Vercel project → **Settings → Domains** → add `sahilsapra.com` and `www.sahilsapra.com`. Vercel shows the exact DNS records.
   - If your registrar is **Cloudflare**: add an `A` record for the apex (`@`) to Vercel's IP and a `CNAME` for `www` to `cname.vercel-dns.com`, both **DNS-only (grey cloud)** so Vercel manages TLS. (Vercel will display the current target values — use those.)
   - If **Namecheap**: set the apex via Vercel's recommended `A`/`ALIAS` record and `www` via `CNAME` to `cname.vercel-dns.com`.
6. Wait for DNS propagation (minutes to a couple hours) and the TLS cert to issue. Vercel handles HTTPS automatically.
7. Set `sahilsapra.com` as the primary domain (redirect `www` → apex or vice-versa, your call).

---

## Phase 6 — Launch checklist

- [ ] Lighthouse (mobile): Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- [ ] Chatbot answers correctly, declines off-topic, respects the rate limit.
- [ ] Analytics: page views register and button events (resume, schedule call, chat, etc.) fire.
- [ ] "Schedule a call" opens the Google Calendar booking page; "Resume" opens the PDF — both in a new tab.
- [ ] OG image renders when you paste the link into LinkedIn/Slack.
- [ ] `sitemap.xml` and `robots.txt` resolve.
- [ ] Works on a real phone (iOS Safari + Android Chrome).
- [ ] Reduced-motion: boot sequence is skipped, content still complete.
- [ ] Resume PDF downloads; all external links open correctly.
- [ ] Update your LinkedIn/GitHub bios with the new domain.

---

## Cost expectation
- Domain: ~$10–12/yr.
- Vercel Hobby + Web Analytics: $0 (analytics has a generous free event allowance; this event set stays well under it).
- Upstash free tier: $0.
- OpenRouter: pay-as-you-go per token; a cheap model runs pennies per conversation, bounded by your rate limit + the spend cap on the key. Idle = $0.

Effectively a few dollars a year plus tiny per-chat usage — and the chatbot cost is hard-capped by the limiter and your OpenRouter spend limit.

---

## Quick reference — who gets which file
| File | Goes to |
|---|---|
| `DESIGN_BRIEF.md` (+ `profile.json`) | **Claude Design** (Phase 1) |
| `PRD.md`, `TECHNICAL_SPEC.md`, `profile.json` (+ Phase-1 tokens) | **Claude Code** (Phase 2) |
| `README.md`, `ROADMAP.md` | **You** — repo + execution |
