# Design Brief — sahilsapra.com

**For:** Claude Design (wireframe + visual system) → output feeds Claude Code
**Companion docs:** `PRD.md`, `TECHNICAL_SPEC.md`, `content/profile.json`
**Last updated:** 2026-06-22

---

## 1. The subject, in one line

Sahil Sapra is a technical product manager whose entire career theme is **release quality** — QA automation, CI/CD, zero-downtime migrations, "does it ship clean?" The site should *feel* like that: precise, instrumented, and confidently green.

**Audience:** recruiters and hiring managers (US & India) who scan fast and trust evidence.
**The page's one job:** make them believe, in under a minute, that Sahil ships quality — then let them dig or ask.

---

## 2. Design thesis & signature

**Thesis:** the website behaves like a passing build. Not a generic "dark terminal" portfolio — a site instrumented like the release pipelines Sahil actually manages.

**Signature element (spend the boldness here, keep everything else quiet):**
A brief **boot/check sequence** on load — three or four QA-style lines resolve to green checks and settle into a persistent **`build: passing`** status chip that lives in the nav for the rest of the session. The checkmark green is *functional* (it means "verified"), not decoration — which is exactly why it earns its place and doesn't read as the default acid-accent dark theme.

Everything else on the page is calm: generous space, strict type, restrained motion.

### Reference calibration
- Take **structure** from connorhyatt.com: clean personal intro, Work/Education toggle, evidence-tagged project cards, a docked "support" chatbot framed as a person you can message.
- Take **dynamic personality** from aditya-venkatesan-gtm.vercel.app: numbered section eyebrows (№ 01…), live-log motion, marquee, count-ups, a confident technical voice — but **lighter and warmer**, not a wall of green-on-black terminal text. Borrow the energy, not the exact look.

---

## 3. Token system

### Color — "Instrument" palette
Dark is default (instrumentation/console feel); light is a clean, credible alternative for recruiters who prefer it.

```
--ink            #0B0F17   /* near-black slate — primary dark bg, not pure black */
--surface        #121826   /* raised cards/panels on dark */
--line           #1F2A3C   /* hairline borders, dividers */
--brand          #2163CA   /* Sahil's resume blue — primary accent, links, focus */
--brand-soft     #3B82F6   /* brighter blue for hover/active on dark */
--pass           #2FA75A   /* the functional "verified / passing" green — used sparingly */
--text-hi        #E8ECF3   /* high-emphasis text on dark */
--text-lo        #9AA7BD   /* secondary text, labels, captions */

/* light mode */
--l-bg           #F7F8FA
--l-surface      #FFFFFF
--l-line         #E5E9F0
--l-text-hi      #0B0F17
--l-text-lo      #51607A
/* brand + pass carry over unchanged */
```
Rule: **blue is the brand; green only ever means "passing/verified."** Never use green decoratively. This single discipline keeps the QA metaphor honest and the page from looking like a default neon-dark template.

### Typography
Three roles, deliberately paired — not the same families used on every portfolio.

| Role | Face | Use |
|---|---|---|
| Display | **Space Grotesk** (or **Geist**) | Name, section headers, big numbers. Slightly mechanical, modern, technical-but-human |
| Body | **Inter** | Paragraphs, bullets, UI |
| Mono / data | **Geist Mono** (or **JetBrains Mono**) | Boot-sequence log lines, metric pills, status chip, code-ish labels, eyebrows |

Type scale (desktop): display 56–72 / h2 32 / h3 20 / body 16 / caption 13. Tighten display tracking slightly; set mono at a comfortable 14–15 with generous letter-spacing for the "instrument readout" feel.

### Layout
- Max content width ~1080px, centered, with a comfortable left rail for the numbered section eyebrows on desktop.
- Hairline dividers (`--line`), **near-zero border radius** on structural elements (4px max) to read as "instrument panel," but **pills and the chat bubble are pill-shaped** for warmth.
- Strong vertical rhythm; let sections breathe.

### Signature recap
Boot sequence → persistent `build: passing` chip. That's the one thing the site is remembered by.

---

## 4. Section-by-section wireframes (ASCII, desktop)

### Nav (persistent)
```
┌────────────────────────────────────────────────────────────────────┐
│  SS·                 work   projects   stack   contact   [◐]  ●passing│
└────────────────────────────────────────────────────────────────────┘
   logo                anchor nav                  theme   status chip
```

### Hero  (#top)
```
  ┌──────────────────────────────────────────────────────────────┐
  │  > running checks…                                            │   ← boot lines
  │    environment ✓   experience ✓   projects ✓   → build passing│   ← resolve to green
  │                                                               │
  │  SAHIL SAPRA                                                  │   ← display, large
  │  Technical Product Manager & Product Owner                    │
  │  I ship software that ships clean.                            │   ← tagline
  │                                                               │
  │  ● open to AI-first PM roles · US & India                     │   ← availability (live dot)
  │                                                               │
  │  [ Resume ↓ ] [ Ask Sahil ] [ Schedule a call ] [in] [gh] [✉] │   ← CTAs (Resume + Schedule open new tab)
  │                                                               │
  │  ┌────────┬────────┬────────┬────────┬────────┬────────┐      │
  │  │  75    │ 104%   │  68%   │ 400%   │62→81%  │   4    │      │   ← headline metrics
  │  │customers│YoY ARR│latency↓│release↑│QA cov. │partners│      │     (count-up animate)
  │  └────────┴────────┴────────┴────────┴────────┴────────┘      │
  └──────────────────────────────────────────────────────────────┘
```

### Work / Experience  (#work)
```
  № 01 ─ experience                                  [ Work | Education ]   ← toggle
  ────────────────────────────────────────────────────────────────────
  SpecHawk Inc. ↗                                        2026 – Present ●live
     Head of Product / Co-Founder
     Directed an AI-powered, deploy-aware no-code agentic QA platform…
     • Secured four design partners…                          [4 partners]
     • Delivered MVP, advanced V2/V3 (Security Hub, CLI…)      [MVP + V2/V3]
     • Raised pre-seed capital                                 [pre-seed]
  ────────────────────────────────────────────────────────────────────
  CAMP Systems International Inc.                            2024 – 2026
     ├ Technical BA / Product Manager II            2025 – 2026           ← nested roles
     │   • 75-customer migration…            [75 customers · 104% YoY ARR]
     │   • Monolith → microservices…                  [68% latency ↓]
     │   • QA coverage 62→81%…                         [62% → 81%]
     └ Business Analyst / Product Manager           2024 – 2025
         • LaunchDarkly rollout…                      [400% release freq.]
         • Feature-flag web app…                      [7% OPEX ↓]
  ────────────────────────────────────────────────────────────────────
  World Kinect …  (two nested roles, metric pills)          2022 – 2024
```
Each `metric` becomes a **mono pill** in `--pass` or `--brand`. Nested sub-roles under one company block with a left connector rule.

### Projects  (#projects)
```
  № 02 ─ selected projects
  ────────────────────────────────────────────────────────────────────
  ┌───────────────────────────┐  ┌───────────────────────────┐
  │ EY Blockchain Comp   2021 │  │ Redhawk Digital Asset Fund │
  │ Team Lead        [2nd place]│  │ Founder / VP   [student fund]│
  │ Blockchain solution to stop │  │ Co-founded a university-    │
  │ vaccination-record fraud…   │  │ funded crypto fund…         │
  │ #Ethereum #Solidity #Supply │  │ #Crypto #Tokenomics #IPS    │
  │ ▸ details                   │  │ ▸ details                   │   ← expand in place
  └───────────────────────────┘  └───────────────────────────┘
  ┌───────────────────────────┐  ┌───────────────────────────┐
  │ DD Classifier        2021 │  │ Tableau + ETL Automation   │
  │ [~250 evaluated → 8]        │  │ [~300% faster delivery]     │
  └───────────────────────────┘  └───────────────────────────┘
  (P&G Challenge · Engineers Without Borders …)
```
Aditya-style "evidence" framing: each card **leads with the concrete result** as a pill.

### Stack  (#stack)
```
  № 03 ─ stack
  ────────────────────────────────────────────────────────────────────
  Cloud & Infrastructure   AWS · Azure · GCP · Docker · Terraform · …
  CI/CD & DevOps           LaunchDarkly · New Relic · Feature Flags · …
  Languages & Frameworks   TypeScript · Python · Next.js · Java · …
  API Development          REST · GraphQL · Microservices · Caching · …
  AI & Product Tooling     Claude Code · Cursor · Jira · Snowflake · …

  AREAS OF EXPERTISE                       CERTIFICATIONS
  ▸ Product Lifecycle Mgmt   ▸ QA Auto.    ✓ AWS Cloud Practitioner
  ▸ Scalable Architecture    ▸ CI/CD …     ✓ ICAgile · Aha! · Atlassian …
```

### Contact + Chatbot  (#contact, plus docked launcher everywhere)
```
  № 04 ─ contact
  ────────────────────────────────────────────────────────────────────
  Want the fast version? Ask the agent. Ready to talk? Book a call.
  [ Schedule a call ] [ Ask Sahil ] [ Email ] [ LinkedIn ] [ Resume ↓ ]
        ▲ primary — opens Google Calendar in a new tab          ▲ PDF, new tab

                                              ┌──────────────────────┐
                              docked launcher │  Ask Sahil        ✕  │
                                   ╭───────╮   │ ───────────────────── │
                                   │ Ask   │   │ greeting bubble…     │
                                   │ Sahil │   │ [suggested q] [q] [q]│
                                   ╰───────╯   │ ───────────────────── │
                                              │ [ type a question… ▸]│
                                              └──────────────────────┘
```

### Mobile
Single column; nav collapses to a compact bar with the status chip persistent; metrics become a 2-col grid; chat launcher is a FAB bottom-right opening a full-height sheet; boot sequence runs once, shorter.

---

## 5. Component inventory (hand back to Claude Code)
`Nav`, `StatusChip`, `ThemeToggle`, `Hero`, `BootSequence`, `HeadlineMetrics` (count-up), `SectionLabel` (numbered eyebrow), `WorkEducationToggle`, `CompanyCard`, `RoleBlock`, `MetricPill`, `ProjectCard` (expandable), `SkillGroup`, `Certifications`, `ContactSection`, `ScheduleCallButton` (primary CTA, new-tab), `ResumeButton` (new-tab PDF), `ChatLauncher`, `ChatPanel`, `ChatMessage`, `SuggestedQuestions`, `Footer`.

---

## 6. Motion spec (restrained)
| Element | Motion | Reduced-motion fallback |
|---|---|---|
| Boot sequence | Lines type/resolve to checks, then collapse into the nav chip (~1.6s, skippable) | Render final `build: passing` state instantly |
| Headline metrics | Count-up on first scroll into view | Show final numbers immediately |
| Sections | Fade+rise 12px on scroll-in, staggered | No transform; show in place |
| Cards / buttons | Subtle lift + border-brighten on hover | None |
| Status chip | Slow pulse on the dot only | Static dot |
| Chat panel | Slide/scale in | Fade only |

One orchestrated moment (the boot sequence) does the heavy lifting; the rest is quiet. Per the "remove one accessory" rule: if anything beyond the boot sequence starts to feel showy, cut it.

---

## 7. Accessibility & quality floor
Contrast ≥ 4.5:1 for body text in both themes; visible keyboard focus using `--brand`; full keyboard operability for nav, toggles, project expanders, and chat; `prefers-reduced-motion` honored everywhere; alt text on the headshot; semantic landmarks (`header`/`main`/`section`/`footer`).

---

## 8. What Claude Design should output
1. A short written **design plan** confirming the tokens above (or a justified revision).
2. **Wireframe screens** for: hero (mid-boot and resolved), work (both toggle states), projects (collapsed + one expanded), stack, and the chat panel (desktop drawer + mobile sheet) — in both dark and light.
3. A **component spec sheet** (states: default/hover/focus/active/disabled) for `MetricPill`, `ProjectCard`, `StatusChip`, `ChatPanel`.
4. Final **design tokens** as CSS variables ready to paste into `app/globals.css`.
