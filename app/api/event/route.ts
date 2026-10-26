import { readTextWithLimit } from "@/lib/request";

// Lightweight, privacy-first analytics: only allow a fixed event vocabulary.
// No database, cookies, IP addresses or user-entered text is persisted.
export const runtime = "nodejs";

const ALLOWED = new Set([
  "resume_viewed", "schedule_call_clicked", "chat_opened", "chat_message_sent",
  "linkedin_clicked", "github_clicked", "email_clicked", "youtube_clicked",
  "project_expanded", "project_link_clicked", "all_projects_clicked", "theme_toggled",
]);

const PROP_KEYS = new Set(["project", "link", "to"]);

export async function POST(req: Request) {
  try {
    const raw = await readTextWithLimit(req, 2000);
    if (raw === null) return new Response(null, { status: 413 });
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) return new Response(null, { status: 204 });
    const record = body as Record<string, unknown>;
    if (typeof record.event !== "string" || !ALLOWED.has(record.event)) return new Response(null, { status: 204 });
    const props: Record<string, string> = {};
    if (record.props && typeof record.props === "object" && !Array.isArray(record.props)) {
      for (const [key, value] of Object.entries(record.props)) {
        if (PROP_KEYS.has(key) && typeof value === "string") props[key] = value.slice(0, 80);
      }
    }
    console.log(JSON.stringify({
      type: "site_event",
      event: record.event,
      props,
      path: typeof record.path === "string" && record.path.startsWith("/") ? record.path.slice(0, 120) : null,
    }));
  } catch {
    // malformed telemetry must never break the page
  }
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
