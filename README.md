<div align="center">

# sahilsapra.com

**Personal site of Sahil Sapra — Technical Product Manager.**
A fast, accessible portfolio with an AI chatbot that answers questions about my work — built like the release pipelines I manage: instrumented, evidence-backed, and green.

[**Live**](https://sahilsapra.com) → [LinkedIn](https://www.linkedin.com/in/sahil-sapra/)

</div>

## Overview

A single-page Next.js portfolio presenting my experience, projects, skills, and certifications, plus **"Ask Sahil"** — an AI agent grounded strictly in my real profile data that recruiters and hiring managers can question directly. All site content lives in one JSON file, so the site stays trivial to update.

## Features

- **Evidence-first experience timeline** — every accomplishment leads with a metric (75-customer zero-downtime migration, 68% latency reduction, QA coverage 62% → 81%, 400% release-frequency increase, and more), with a Work / Education toggle.
- **Animated headline metrics** — count up on scroll into view; rendered instantly under `prefers-reduced-motion`.
- **AI chatbot** — streaming answers via OpenRouter (any model, set by one env var), grounded only in `content/profile.json`, with per-IP rate limiting and hard cost caps. Off-topic prompts are politely declined and redirected to LinkedIn.
- **Single source of truth** — edit `content/profile.json`; the UI and the chatbot both update.
- **Book a call** — the primary contact CTA opens a Google Calendar booking page; the résumé opens as a PDF in a new tab.
- **Privacy-friendly analytics** — page views plus a small fixed set of button-click events (no cookies, no third-party trackers).
- **Dark / light themes** with an animated circular reveal on toggle, responsive down to 320px, WCAG-AA targeted, a custom pointer (desktop), and full `prefers-reduced-motion` support.

## Tech stack

| | |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, CSS-variable design tokens, `next-themes` |
| Fonts | `next/font` (self-hosted): Instrument Serif, Space Grotesk, JetBrains Mono, Inter |
| Chatbot | OpenRouter (OpenAI-compatible streaming) via a server route handler — any model via one env var |
| Rate limiting | Upstash Redis + `@upstash/ratelimit` |
| Analytics | Vercel Web Analytics (page views + custom click events) |
| Hosting | Vercel |

> **Why a direct OpenRouter fetch instead of the Vercel AI SDK?** The route streams from OpenRouter's OpenAI-compatible endpoint with a tiny, fully-owned `ReadableStream`. It keeps the dependency surface minimal and avoids the version-coupling between `ai` and `@openrouter/ai-sdk-provider`. Same behavior the PRD asks for: token-by-token streaming, grounded in `profile.json`, rate-limited, server-only key.

## Getting started

```bash
git clone https://github.com/sahilsapra391/sahilsapra-website.git
cd sahilsapra-website
pnpm install
cp .env.example .env.local      # then fill in your keys (optional for local UI work)
pnpm dev                        # http://localhost:3000
```

The site runs fully without any env vars — the chatbot simply replies with a "reach me on LinkedIn / book a call" message until `OPENROUTER_API_KEY` is set. Rate limiting no-ops locally when the Upstash vars are absent.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `OPENROUTER_API_KEY` | for live chat | Chatbot model calls via OpenRouter (**server-only**) |
| `OPENROUTER_MODEL` | optional | Model slug, e.g. `anthropic/claude-3.5-haiku`; defaults in code |
| `UPSTASH_REDIS_REST_URL` | for rate limiting | Chatbot abuse protection (per-IP) |
| `UPSTASH_REDIS_REST_TOKEN` | for rate limiting | Chatbot abuse protection (per-IP) |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical URL for sitemap / robots / OG (defaults to `https://sahilsapra.com`) |

`OPENROUTER_API_KEY` is read **server-side only** (in `app/api/chat/route.ts`) and never reaches the client bundle.

## Updating content

Edit **`content/profile.json`** — identity, experience, projects, skills, certifications, headline metrics, and chatbot copy all live there. The TypeScript types in `lib/types.ts` mirror its shape. No component edits required.

## Scripts

```bash
pnpm dev         # local dev server
pnpm build       # production build
pnpm start       # serve the production build
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
```

## Project structure

```
app/             routes, layout, chatbot API route, sitemap/robots, dynamic OG image
components/      layout (nav/footer/theme/cursor/background), hero, work, projects, stack, contact, chat, ui
content/         profile.json — single source of truth
lib/             typed profile loader, types, system prompt, rate limiter, analytics
public/          résumé PDF, headshot, favicons
```

## Deployment

Deployed on Vercel. Push to `main` → production; PRs get preview deploys. Add the env vars in **Vercel → Project → Settings → Environment Variables** (Production + Preview), then enable **Web Analytics** in the dashboard. See [`ROADMAP.md`](./ROADMAP.md) for domain/DNS setup.

## Security

- API key is **server-only**; `.env*` is gitignored (`.env.example` is committed with placeholders).
- The chatbot is protected by per-IP rate limiting (15 messages/hour), an input-length cap, a capped `max_tokens`, and a strict system prompt grounded only in `profile.json`. Pair this with a spend limit on the OpenRouter key.
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) are set in `next.config.ts`.

## License

[MIT](./LICENSE) © Sahil Sapra

---

<div align="center">
<sub>Built with Next.js. Content in JSON, answers via OpenRouter, hosted on Vercel.</sub>
</div>
