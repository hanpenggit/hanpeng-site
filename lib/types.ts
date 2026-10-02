// TypeScript types mirroring content/profile.json — the single source of truth.
// Keep these in sync with the JSON shape.

export type Tone = "pass" | "brand";

export interface ProfileMeta {
  version: string;
  lastUpdated: string;
  note: string;
  /** Canonical URL of THIS site (not the product link in identity.links). */
  siteUrl?: string;
  siteUrlNote?: string;
}

export interface Links {
  email: string;
  emailHref: string;
  linkedin: string;
  github: string;
  youtube: string;
  resume: string;
  scheduleCall: string;
  website: string;
}

export interface Identity {
  name: string;
  title: string;
  /** Optional second line under the title, e.g. "Independent Developer · AI Builder". */
  roleLine?: string;
  taglineLead: string;
  taglineAccent: string;
  heroSummary: string;
  availability: string;
  location: string;
  locationShort: string;
  summary: string;
  about: string;
  openTo: string[];
  links: Links;
}

export interface HeadlineMetric {
  lead: string;
  value: number;
  suffix: string;
  label: string;
  detail: string;
  tone: Tone;
}

export interface Bullet {
  text: string;
  metric: string;
  tone: Tone;
}

export interface Role {
  title: string;
  dates: string;
  summary: string;
  bullets: Bullet[];
}

export interface Company {
  company: string;
  companyUrl: string;
  location: string;
  dates: string;
  current: boolean;
  roles: Role[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  dates: string;
  honors: string[];
  inProgress: boolean;
  coursework: string[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

/** One "how I solved it" bullet inside a project's expanded panel. */
export interface Highlight {
  title: string;
  detail: string;
}

/** "What I Build" card — replaces the old resume-style capability card. */
export interface BuildGroup {
  num: string;
  title: string;
  headline: string;
  detail: string;
}

export interface ProfileBuild {
  title: string;
  /** English accent label rendered next to the Chinese title, e.g. "What I Build". */
  titleEn?: string;
  description: string;
  groups: BuildGroup[];
}

/** One experiment card in the AI Lab section. */
export interface AiExperiment {
  title: string;
  description: string;
  tags: string[];
}

export interface AiLab {
  title: string;
  /** English accent label rendered next to the Chinese title, e.g. "AI Lab". */
  titleEn?: string;
  /** Short mono accent line above the description, e.g. "Exploring AI beyond chat." */
  tagline?: string;
  description: string;
  experiments: AiExperiment[];
}

export interface PhilosophyItem {
  num: string;
  title: string;
  detail: string;
}

export interface NowItem {
  status: string;
  title: string;
  description: string;
}

export interface NowData {
  updated: string;
  items: NowItem[];
}

export interface Project {
  name: string;
  /** English subtitle, e.g. "Family Knowledge Network" — shown under the name. */
  subtitle?: string;
  /** Featured projects render as a full-width hero card instead of a grid cell. */
  featured?: boolean;
  year: string;
  role: string;
  metric: string;
  tags: string[];
  blurb: string;
  detail: string;
  /** Optional "架构亮点" bullets shown in the expanded panel. */
  highlights?: Highlight[];
  // Live site / repo, shown inside the expanded detail panel.
  links?: ProjectLink[];
}

export interface Chatbot {
  enabled?: boolean;
  displayName: string;
  subtitle: string;
  greeting: string;
  suggestedQuestions: string[];
  escalationNote: string;
}

export interface Analytics {
  note: string;
  events: string[];
}

export interface Profile {
  meta: ProfileMeta;
  identity: Identity;
  headlineMetrics: HeadlineMetric[];
  /** "What I Build" — replaces resume-style capabilities. */
  build?: ProfileBuild;
  experience: Company[];
  education: Education[];
  skills: Record<string, string[]>;
  /** Optional 实战注脚 rendered under each skill group (key = group name). */
  skillNotes?: Record<string, string>;
  areasOfExpertise: string[];
  projects: Project[];
  aiLab?: AiLab;
  philosophy?: PhilosophyItem[];
  now?: NowData;
  certifications: string[];
  chatbot: Chatbot;
  analytics: Analytics;
}
