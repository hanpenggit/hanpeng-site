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

export interface Project {
  name: string;
  year: string;
  role: string;
  metric: string;
  tags: string[];
  blurb: string;
  detail: string;
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
  experience: Company[];
  education: Education[];
  skills: Record<string, string[]>;
  areasOfExpertise: string[];
  projects: Project[];
  certifications: string[];
  chatbot: Chatbot;
  analytics: Analytics;
}
