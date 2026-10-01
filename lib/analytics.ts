// Custom click events (resume viewed, chat opened, …).
//
// Cloudflare Web Analytics' beacon does NOT support custom events — it only
// reports page views and Core Web Vitals. So events are sent in this order:
//   1. Zaraz (zaraz.track) if you enabled it in the Cloudflare dashboard
//   2. this site's own /api/event endpoint (sendBeacon → Worker log)
// Both are optional: with neither configured the call is a no-op and the UI
// never breaks.
//
// Keep the event list small and typo-proof — it mirrors
// content/profile.json → analytics.events.
export type AnalyticsEvent =
  | "resume_viewed"
  | "schedule_call_clicked"
  | "chat_opened"
  | "chat_message_sent"
  | "linkedin_clicked"
  | "github_clicked"
  | "email_clicked"
  | "youtube_clicked"
  | "project_expanded"
  | "project_link_clicked"
  | "all_projects_clicked"
  | "theme_toggled"
  | "about_opened";

type Zaraz = { track: (name: string, props?: Record<string, unknown>) => void };

export function logEvent(
  event: AnalyticsEvent,
  props?: Record<string, string>,
): void {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as { zaraz?: Zaraz };
    if (typeof w.zaraz?.track === "function") {
      w.zaraz.track(event, props);
      return;
    }
    const payload = JSON.stringify({ event, props, path: location.pathname });
    navigator.sendBeacon?.("/api/event", payload);
  } catch {
    // analytics must never break the UI
  }
}
