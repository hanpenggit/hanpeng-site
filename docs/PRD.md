# PRD — sahilsapra.com

**Owner:** Sahil Sapra
**Status:** Ready for build
**Last updated:** 2026-06-22
**Audience for this doc:** Claude Code (engineering), Claude Design (visual)

---

## 1. Summary

A personal portfolio site at `sahilsapra.com` that presents Sahil Sapra — a technical product manager focused on QA automation, release quality, and AI-enabled developer workflows — as a credible, hireable product leader. The site combines a structured resume/timeline experience with a dynamic, terminal-inflected interface and an AI chatbot that can answer questions about Sahil on demand.

The single throughline: **Sahil ships software that ships clean.** Every design and content choice reinforces release quality / QA as his professional signature.

---

## 2. Goals & non-goals

### Goals
1. Convince a recruiter or hiring manager, in under 60 seconds, that Sahil is a strong technical PM.
2. Make every accomplishment **evidence-backed** — lead with the metric, not the buzzword.
3. Provide an AI chatbot ("Ask Sahil") that answers free-form questions about his background, sourced only from his real data.
4. Serve as a professional, well-documented **public GitHub repository** — this is Sahil's first flagship open-source contribution, so code quality and docs matter as much as the live site.
5. Be fast, accessible, responsive, and cheap to run on Vercel's free/hobby tier.

### Non-goals
- Not a blog/CMS at launch (a `/blog` route is a future phase, scaffolded but optional).
- No user accounts, no auth, no database of visitor data.
- No e-commerce, no paid features.
- The chatbot is **not** a general-purpose assistant — it only discusses Sahil and politely deflects off-topic prompts.

---

## 3. Target users

| User | What they want | What the site must do |
|---|---|---|
| **Recruiter** (US & India) | Quick scan: is he qualified, is he available, how do I reach him? | Headline metrics + clear "open to" status + resume + 1-click contact above the fold |
| **Hiring manager / founder** | Depth: can he actually do the work? Proof? | Evidence-rich experience cards, real projects, the chatbot for follow-ups |
| **Peer / collaborator** | What's he built, what's his stack? | Skills, projects, GitHub link, clean repo |
| **Sahil himself** | Easy to update as roles/projects change | All content in one `profile.json`; no hunting through components |

---

## 4. Content model (single source of truth)

All site content lives in **`/content/profile.json`** (provided alongside this PRD). Components and the chatbot both read from it. Updating the site = editing one JSON file.

Top-level keys: `identity`, `summary`, `headlineMetrics`, `experience[]`, `education[]`, `skills{}`, `areasOfExpertise[]`, `projects[]`, `certifications[]`, `chatbot{}`.

> **Content sourcing rule (from Sahil):** Work experience, education, skills, areas of expertise, and headline metrics come from the **main resume**. The **Projects** section is sourced from the two earlier resumes (EY blockchain comp, Redhawk Digital Asset Fund, Keiretsu classifier, Tableau/ETL work, P&G challenge, Engineers Without Borders). This split is already reflected in `profile.json`.

---

## 5. Information architecture

Single-page scroll with anchor nav (primary), plus one optional sub-route.

```
/                      → the whole experience (scroll)
   #top / hero         → intro + status + headline metrics
   #work               → experience timeline (Work / Education toggle)
   #projects           → project gallery with evidence
   #stack              → skills + areas of expertise + certs
   #contact            → contact + chatbot entry
/blog        (future)  → scaffold only, hidden from nav until used
```

Persistent global UI: top nav, theme toggle (dark default / light), and a docked **"Ask Sahil"** chat launcher.

---

## 6. Features & requirements

### 6.1 Hero / boot sequence (signature moment)
- On first load, a short **"running checks"** animation: a few QA-style log lines resolve to green checkmarks (`environment ✓`, `experience ✓`, `projects ✓`), ending on a persistent **`build: passing`** status chip. This is the site's signature element — it literally renders Sahil as a passing build.
- Animation duration ≤ ~1.8s, **skippable**, and fully bypassed when `prefers-reduced-motion` is set (show the resolved end-state immediately).
- Hero contains: name, title, one-line tagline, an "open to" availability line, primary CTAs (Resume ↓, Ask Sahil, Schedule a call, LinkedIn, GitHub, Email).
- The **Resume** CTA opens `/Sahil_Sapra_Resume.pdf` in a **new tab** (browser-native PDF view + download). The **Schedule a call** CTA opens Sahil's Google Calendar booking page in a new tab.
- Below the headline: the 6 `headlineMetrics` as animated count-up stats.

**Acceptance:** Hero is legible and complete within 1 frame for reduced-motion users; metrics are real numbers from `profile.json`; CTAs all work.

### 6.2 Experience timeline (`#work`)
- A **Work / Education** toggle (like the reference sites).
- Each company is a card: name (+ link if present), location, date range, and one or more **roles** (CAMP and World Kinect each have two roles — render as nested sub-roles under one company block).
- Each role: title, dates, a one-line summary, and bullet points. Each bullet may carry a `metric` badge — render the metric as a small pill so the number is scannable.
- A current role gets a subtle "live" indicator (pulsing dot) — SpecHawk.

**Acceptance:** All five companies render with correct nested roles; metric pills visible; toggle switches cleanly; "live" indicator only on current roles.

### 6.3 Projects (`#projects`)
- Gallery of `projects[]`. Each card: name, year, role, blurb, expandable detail, tech tags, optional links, and the headline `metric`.
- Borrow the **"evidence" treatment** from the Aditya reference: each card states a concrete artifact/result (e.g., "2nd place," "~250 startups evaluated → 8 surfaced"). Lead with the result.
- Cards expand in place (accordion or modal) to show `detail`.

**Acceptance:** All 6 projects render; tags and metrics display; expand/collapse works by keyboard and pointer.

### 6.4 Stack (`#stack`)
- **Skills** grouped by the 5 categories in `profile.json` (Cloud & Infra, CI/CD & DevOps, Languages & Frameworks, API Development, AI & Product Tooling).
- **Areas of Expertise** as a labeled grid.
- **Certifications** as a compact list with issuer badges/icons.

**Acceptance:** Categories match JSON; nothing hard-coded in components.

### 6.5 "Ask Sahil" chatbot (`#contact` + docked launcher)
The flagship interactive feature. Modeled on the reference site's support-chat framing.

Requirements:
- Floating launcher button, opens a chat panel (drawer on desktop, full-sheet on mobile).
- Shows `chatbot.greeting` and `chatbot.suggestedQuestions` as tappable chips.
- Streams responses token-by-token.
- Answers **only** from Sahil's data (his `profile.json` is injected into the system prompt — see TECHNICAL_SPEC §Chatbot). It must not invent facts, must not answer unrelated questions, and must point off-topic or unanswerable queries to Sahil's LinkedIn (`chatbot.escalationNote`).
- Persists conversation in component state for the session only (no storage, no PII collection).
- Hard guardrails: input length cap, output `max_tokens` cap, and server-side **rate limiting** (this repo is public and the API key is live — abuse protection is mandatory, not optional).

**Acceptance:** Streaming works; suggested questions prefill; off-topic prompt → polite deflection to LinkedIn; rate limit returns a friendly message, not a crash; the `OPENROUTER_API_KEY` is never present in any client bundle.

### 6.6 Global
- **Theme toggle:** dark default, light alternative; respects system preference on first visit; choice held in state (no localStorage in artifacts/SSR-unsafe code — use a cookie or `next-themes`).
- **Responsive:** flawless from 320px to widescreen.
- **SEO:** title, description, Open Graph image, `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema built from `profile.json`.
- **Analytics (small + privacy-friendly):** Vercel Web Analytics for automatic page views, unique visitors, referrers, devices, and countries — plus a small fixed set of custom button-click events (resume viewed, schedule-call clicked, chat opened, message sent, LinkedIn/GitHub/email clicked, project expanded, theme toggled). No cookies, no PII, no third-party trackers. The full event list lives in `profile.json → analytics.events`.
- **Accessibility:** WCAG 2.1 AA target — keyboard nav, visible focus, alt text, color contrast ≥ 4.5:1 for body text, reduced-motion honored everywhere.

### 6.7 Contact & scheduling (`#contact`)
- A contact section offering three clear paths: **Schedule a call** (Google Calendar booking link → new tab), **Email**, **LinkedIn**, plus a **Resume ↓** (new-tab PDF) and the **Ask Sahil** chatbot for the fast version.
- The "Schedule a call" CTA is the primary action here — it converts an interested recruiter directly into a booked conversation.

**Acceptance:** Schedule-a-call opens the Google Calendar link in a new tab and fires the `schedule_call_clicked` event; resume opens the PDF in a new tab and fires `resume_viewed`; email/LinkedIn links work and fire their events.

---

## 7. Success criteria

| Metric | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices / SEO | ≥ 95 |
| Largest Contentful Paint | < 2.0s on 4G |
| Chatbot first-token latency | < 1.5s typical |
| Cost on Vercel hobby + capped chatbot | ~$0/mo idle; bounded by rate limits |
| API key exposure | Zero — server-only |

---

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Public repo leaks the live API key | Key is server-only env var; `.env*` gitignored; `.env.example` with placeholders; never referenced client-side |
| Chatbot abuse runs up API cost | Rate limit per IP + input length cap + low `max_tokens` + a cheap model via OpenRouter + a spend cap on the key |
| Chatbot hallucinates about Sahil | Strict system prompt grounded in `profile.json`; instruction to refuse unknowns and defer to LinkedIn |
| Motion feels gimmicky / AI-generated | One signature animation only (boot/build-status); everything else quiet; reduced-motion respected |
| Site goes stale | All content in `profile.json`; documented update flow in README |

---

## 9. Out of scope for v1 (future phases)
- Blog/MDX content pipeline.
- Downloadable PDF "print edition" of the site (Aditya does this — nice-to-have later).
- Multi-language (EN/HI) for India-market roles.
- Contact form with email delivery (chatbot + mailto covers v1).
