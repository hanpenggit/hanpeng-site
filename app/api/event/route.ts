// Receives custom analytics beacons from lib/analytics.ts.
//
// There is no third-party tracker involved: the event lands in this Worker's
// log. Read them with `npx wrangler tail` or in the Cloudflare dashboard under
// Workers → Logs. If you later want dashboards, add an Analytics Engine
// binding and write the event there instead.
export const runtime = "edge";

type Payload = {
  event?: unknown;
  props?: unknown;
  path?: unknown;
};

const ALLOWED = new Set([
  "resume_viewed",
  "schedule_call_clicked",
  "chat_opened",
  "chat_message_sent",
  "linkedin_clicked",
  "github_clicked",
  "email_clicked",
  "youtube_clicked",
  "project_expanded",
  "project_link_clicked",
  "all_projects_clicked",
  "theme_toggled",
  "about_opened",
]);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const event = typeof body.event === "string" ? body.event : "";
    if (!ALLOWED.has(event)) return new Response(null, { status: 204 });
    console.log(
      JSON.stringify({
        type: "site_event",
        event,
        props: body.props ?? null,
        path: typeof body.path === "string" ? body.path.slice(0, 200) : null,
        country: req.headers.get("cf-ipcountry"),
      }),
    );
  } catch {
    // ignore malformed beacons
  }
  return new Response(null, { status: 204 });
}
