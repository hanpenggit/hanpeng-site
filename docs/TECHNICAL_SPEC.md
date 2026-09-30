# Technical Spec / POC — sahilsapra.com

**For:** Claude Code
**Companion docs:** `PRD.md`, `DESIGN_BRIEF.md`, `content/profile.json`
**Last updated:** 2026-06-22

This document is the proof-of-concept and engineering plan. It defines the stack, project structure, the chatbot architecture (the only non-trivial backend), security posture for a **public** repo, and deployment.

---

## 1. Stack decision

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + React 19 + TypeScript** | First-class on Vercel; SSR/SSG for SEO; route handlers give us a serverless backend for the chatbot without a separate server |
| Styling | **Tailwind CSS v4** + CSS variables for theme tokens | Fast, themeable, matches Design Brief token system |
| Animation | **Framer Motion** (`motion`) | Boot sequence, scroll reveals, count-ups, micro-interactions; respects `prefers-reduced-motion` natively |
| Theming | **next-themes** | Dark/light with system preference, SSR-safe (no localStorage hacks) |
| Icons | **lucide-react** | Clean, consistent, tree-shakeable |
| Chatbot transport | **Vercel AI SDK** (`ai`) + **`@openrouter/ai-sdk-provider`** | Streaming out of the box, `useChat` on the client, route handler on the server |
| LLM | **OpenRouter** — any model via one key. Model chosen by `OPENROUTER_MODEL` env var (default a cheap fast model like `anthropic/claude-3.5-haiku` or `google/gemini-2.0-flash-001`) | One API key, hundreds of models, swap by changing an env var with no code change; small context so no RAG needed |
| Rate limiting | **@upstash/ratelimit** + **Upstash Redis** (free tier) | Serverless-native; protects the public live key from abuse |
| Analytics | **Vercel Web Analytics** (`@vercel/analytics`) + custom `track()` events | Page views/visitors/referrers/devices automatically; button clicks via a small fixed event set. No new account, privacy-friendly, free tier |
| Hosting | **Vercel** | Sahil's stated target; hobby tier is sufficient |
| Package manager | **pnpm** | Fast, deterministic |

> **Why no vector DB / RAG:** Sahil's entire profile fits comfortably in a system prompt (a few KB). Context-stuffing `profile.json` is simpler, cheaper, and more accurate than embeddings for this scale. Revisit RAG only if a blog or long-form corpus is added later.

> **Why OpenRouter:** one key, any model. The model is chosen by the `OPENROUTER_MODEL` env var, so Sahil can switch between Claude, Gemini, GPT, Llama, etc. without touching code. Pick a current slug from openrouter.ai/models.

---

## 2. Project structure

```
sahilsapra-website/
├── app/
│   ├── layout.tsx                # root layout, theme provider, fonts, metadata
│   ├── page.tsx                  # single-page composition of all sections
│   ├── globals.css               # Tailwind + CSS variable tokens (from Design Brief)
│   ├── sitemap.ts                # generated from routes
│   ├── robots.ts
│   ├── opengraph-image.tsx       # dynamic OG image (name + status chip)
│   └── api/
│       └── chat/
│           └── route.ts          # chatbot endpoint (server-only, streams)
├── components/
│   ├── hero/
│   │   ├── Hero.tsx
│   │   ├── BootSequence.tsx      # signature "running checks → build: passing"
│   │   └── HeadlineMetrics.tsx   # count-up stats
│   ├── work/
│   │   ├── ExperienceSection.tsx
│   │   ├── WorkEducationToggle.tsx
│   │   ├── CompanyCard.tsx
│   │   └── RoleBlock.tsx
│   ├── projects/
│   │   ├── ProjectsSection.tsx
│   │   └── ProjectCard.tsx
│   ├── stack/
│   │   ├── StackSection.tsx
│   │   ├── SkillGroup.tsx
│   │   └── Certifications.tsx
│   ├── chat/
│   │   ├── ChatLauncher.tsx      # docked button
│   │   ├── ChatPanel.tsx         # drawer/sheet + message list
│   │   ├── ChatMessage.tsx
│   │   └── SuggestedQuestions.tsx
│   ├── layout/
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx
│   └── ui/                       # small primitives (Pill, StatusChip, SectionLabel…)
├── content/
│   └── profile.json              # SINGLE SOURCE OF TRUTH
├── lib/
│   ├── profile.ts                # typed loader: import profile.json, export typed `profile`
│   ├── types.ts                  # TS types mirroring profile.json
│   ├── system-prompt.ts          # builds the chatbot system prompt from profile
│   ├── ratelimit.ts              # Upstash limiter (no-op fallback if env absent)
│   └── analytics.ts              # tiny typed wrapper over Vercel track()
├── public/
│   ├── Sahil_Sapra_Resume.pdf    # Sahil drops his resume here
│   └── og-fallback.png
├── .env.example                  # documented placeholders, COMMITTED
├── .env.local                    # real secrets, GITIGNORED
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── LICENSE                       # MIT
└── README.md
```

---

## 3. Content loading

`content/profile.json` is imported once and typed. Components never hard-code copy.

```ts
// lib/types.ts  — mirror the JSON shape (abbreviated)
export interface Profile {
  identity: { name: string; title: string; tagline: string; location: string;
    openTo: string[]; links: Record<string, string> };
  summary: string;
  headlineMetrics: { value: string; label: string; detail: string; context: string }[];
  experience: Company[];
  education: Education[];
  skills: Record<string, string[]>;
  areasOfExpertise: string[];
  projects: Project[];
  certifications: string[];
  chatbot: { displayName: string; subtitle: string; greeting: string;
    suggestedQuestions: string[]; escalationNote: string };
}
// …Company, Role, Bullet, Education, Project types follow the JSON exactly.

// lib/profile.ts
import data from "@/content/profile.json";
import type { Profile } from "./types";
export const profile = data as Profile;
```

---

## 4. Chatbot architecture (the core of the POC)

### 4.1 Flow
```
Client (useChat) ──POST /api/chat──► Route handler
                                        │
                                        ├─ rate-limit check (Upstash, per IP)
                                        ├─ validate + truncate input
                                        ├─ build system prompt from profile.json
                                        └─ streamText(Anthropic, Haiku) ──► stream back to client
```

### 4.2 System prompt builder
```ts
// lib/system-prompt.ts
import { profile } from "./profile";

export function buildSystemPrompt(): string {
  return `You are "Ask Sahil," an AI assistant on Sahil Sapra's personal website.
You answer questions about Sahil for recruiters, hiring managers, and collaborators.

RULES:
- Only use the PROFILE DATA below. Never invent employers, dates, metrics, or skills.
- If a question can't be answered from the data, say so briefly and point them to Sahil's LinkedIn: ${profile.identity.links.linkedin}
- If someone wants to reach Sahil, hire him, or book time, share his scheduling link: ${profile.identity.links.scheduleCall}
- Politely decline anything not about Sahil, his work, skills, projects, education, or availability.
- Be concise, warm, and specific. Lead with the concrete result or metric. No corporate filler.
- Speak about Sahil in the third person. Never claim to be Sahil himself.
- Keep answers under ~120 words unless asked for detail.

PROFILE DATA (authoritative):
${JSON.stringify(profile, null, 2)}`;
}
```

### 4.3 Route handler
```ts
// app/api/chat/route.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { limit } from "@/lib/ratelimit";

export const runtime = "nodejs";        // Upstash REST works on edge too; nodejs is the safe default
export const maxDuration = 30;

const MAX_CHARS = 1000;                  // per user message
const MAX_MESSAGES = 20;                 // per conversation

// One key, any model. Swap models by changing the env var — no code change.
const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY! });
const MODEL = process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-haiku";

export async function POST(req: Request) {
  // 1) rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  const { success } = await limit(ip);
  if (!success) {
    return new Response(
      "You've hit the message limit for now — reach Sahil on LinkedIn or book a call.",
      { status: 429 }
    );
  }

  // 2) parse + validate
  const { messages }: { messages: UIMessage[] } = await req.json();
  if (!Array.isArray(messages) || messages.length > MAX_MESSAGES) {
    return new Response("Invalid request.", { status: 400 });
  }
  const last = messages.at(-1);
  const text = last?.parts?.map(p => (p.type === "text" ? p.text : "")).join("") ?? "";
  if (text.length > MAX_CHARS) {
    return new Response("Message too long.", { status: 400 });
  }

  // 3) stream
  const result = streamText({
    model: openrouter(MODEL),
    system: buildSystemPrompt(),
    messages: convertToModelMessages(messages),
    maxOutputTokens: 400,                // hard cost cap
    temperature: 0.4,
  });

  return result.toUIMessageStreamResponse();
}
```
> The exact AI SDK symbol names (`useChat`, `streamText`, message-conversion helpers) shift slightly across SDK majors, and `@openrouter/ai-sdk-provider` tracks AI SDK v6 — Claude Code should pin both versions in `package.json` and verify signatures against the current AI SDK + OpenRouter provider docs at build time. Confirm the `OPENROUTER_MODEL` slug exists on openrouter.ai/models.

### 4.4 Rate limiter (graceful fallback)
```ts
// lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasRedis = !!process.env.UPSTASH_REDIS_REST_URL;

const ratelimiter = hasRedis
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(15, "1 h"),   // 15 msgs / IP / hour
      prefix: "asksahil",
    })
  : null;

export async function limit(id: string) {
  if (!ratelimiter) return { success: true };          // dev fallback — never blocks locally
  return ratelimiter.limit(id);
}
```

### 4.5 Client
Use the AI SDK `useChat` hook in `ChatPanel.tsx`. Wire `chatbot.suggestedQuestions` to prefill+send, render streaming assistant messages, show the greeting on open, and show a friendly inline message on `429`.

---

## 4B. Analytics, resume, and scheduling

### Analytics (small + privacy-friendly)
Use **Vercel Web Analytics** — drop `<Analytics />` (from `@vercel/analytics/react`) into `app/layout.tsx`. That alone gives page views, unique visitors, top pages, referrers, devices, and countries with no extra account.

For "what buttons they clicked," fire **custom events** with `track()` on the exact interactions listed in `profile.json → analytics.events`. Wrap it so event names stay consistent and typo-proof:

```ts
// lib/analytics.ts
import { track } from "@vercel/analytics";

export type AnalyticsEvent =
  | "resume_viewed" | "schedule_call_clicked" | "chat_opened"
  | "chat_message_sent" | "linkedin_clicked" | "github_clicked"
  | "email_clicked" | "project_expanded" | "theme_toggled";

export function logEvent(event: AnalyticsEvent, props?: Record<string, string>) {
  track(event, props);   // no-ops automatically in dev / when analytics is off
}
```
Usage: `onClick={() => logEvent("resume_viewed")}`, `logEvent("project_expanded", { project: p.name })`, etc. Keep the set small — this list is the whole telemetry surface. No cookies, no PII, no third-party script.

> Free-tier note: Vercel Web Analytics includes a monthly event allowance on hobby. This event set is tiny and will stay well under it. If Sahil later wants self-hosted/unlimited, **Umami** or **Plausible** are drop-in alternatives with the same `track()`-style pattern.

### Resume PDF (opens in a new tab)
The resume lives at `public/Sahil_Sapra_Resume.pdf` and the button is a plain anchor that opens the browser's native PDF viewer in a new tab — the visitor can read it inline and download from the viewer:
```tsx
<a
  href={profile.identity.links.resume}   // "/Sahil_Sapra_Resume.pdf"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => logEvent("resume_viewed")}
>
  Resume ↓
</a>
```
No PDF library needed — the static file is served directly and rendered by the browser.

### Scheduling (book a call)
A "Schedule a call" CTA in the contact section (and optionally the hero) links to Sahil's Google Calendar booking page, opening in a new tab:
```tsx
<a
  href={profile.identity.links.scheduleCall}   // Google Calendar appointment link
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => logEvent("schedule_call_clicked")}
>
  Schedule a call
</a>
```
The chatbot also surfaces this link when someone asks how to reach Sahil (see §4.2).

---

## 5. Security posture (public repo — non-negotiable)

1. **API key is server-only.** `OPENROUTER_API_KEY` is read inside `app/api/chat/route.ts` (server). It is **never** imported into a client component, never prefixed `NEXT_PUBLIC_`, never logged.
2. **Secrets are gitignored.** `.gitignore` includes `.env*` (except `.env.example`). Commit `.env.example` with placeholder values only.
3. **Rate limiting is on before launch**, not after. Without it, a public live key on a public repo is a billing incident waiting to happen.
4. **Input/output caps:** `MAX_CHARS`, `MAX_MESSAGES`, `maxOutputTokens`. Bounds worst-case cost per request. Also set a spend limit on the key in the OpenRouter dashboard.
5. **No secrets in OG image / sitemap / client bundles.** Verify with `pnpm build` then grep the `.next` output for the key string (should be absent).
6. **Dependabot + `pnpm audit`** in CI for a clean public-repo signal.

`.env.example`:
```bash
# OpenRouter — one key, any model. Get it at https://openrouter.ai/keys (server-only, never NEXT_PUBLIC_)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
# Pick any current slug from https://openrouter.ai/models
OPENROUTER_MODEL=anthropic/claude-3.5-haiku

# Upstash Redis for chatbot rate limiting (free tier: https://upstash.com)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxx
```

---

## 6. Performance & SEO
- Prefer Server Components; mark only interactive pieces (`BootSequence`, `ChatPanel`, toggles, count-ups) as `"use client"`.
- `next/font` for self-hosted fonts (no layout shift, no third-party request).
- `next/image` for the headshot and any project images.
- `app/sitemap.ts`, `app/robots.ts`, JSON-LD `Person` schema injected in `layout.tsx` built from `profile.identity`.
- Dynamic OG image via `app/opengraph-image.tsx` (name + title + `build: passing` chip).

---

## 7. Testing & CI
- **Type safety:** `tsc --noEmit` in CI.
- **Lint/format:** ESLint + Prettier.
- **Smoke test:** Playwright test that loads `/`, asserts the hero name renders, opens the chat panel, and (mocking the route) asserts a streamed reply appears.
- **CI:** GitHub Actions — install → typecheck → lint → build → (optional) Playwright. Green check on the public repo is part of the professional signal.

---

## 8. Deployment
1. Push to GitHub (public).
2. Import the repo into Vercel.
3. Add env vars in Vercel project settings (`OPENROUTER_API_KEY`, optional `OPENROUTER_MODEL`, Upstash vars) — **Production + Preview**. Enable Web Analytics in the dashboard.
4. Vercel auto-builds on push; preview deploys per PR.
5. Add custom domain `sahilsapra.com` (see ROADMAP.md for DNS).

---

## 9. Build order (suggested for Claude Code)
1. Scaffold Next.js + Tailwind + theme + fonts + tokens from Design Brief.
2. `lib/types.ts`, `lib/profile.ts` — typed content layer.
3. Static sections in order: Hero (no animation yet) → Work → Projects → Stack → Contact (resume + schedule-a-call CTAs) → Footer.
4. Add Framer Motion: boot sequence, scroll reveals, count-ups (reduced-motion guarded).
5. Chatbot: route handler (OpenRouter) + rate limiter + `useChat` panel + suggested questions.
6. Analytics: `<Analytics />` in layout + `logEvent()` wired to the events in `profile.json → analytics.events`.
7. SEO/OG/sitemap/robots/JSON-LD.
8. CI, README, LICENSE, `.env.example`. Lighthouse pass. Ship.
