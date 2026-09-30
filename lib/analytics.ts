// Custom events: forwarded to the Cloudflare Web Analytics beacon
// (window.cfq.sendEvent) when the site includes it; no-op otherwise.

// The complete custom-event surface. Keep this list small and typo-proof —
// it mirrors content/profile.json → analytics.events.
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
  | "theme_toggled";

export function logEvent(
  event: AnalyticsEvent,
  props?: Record<string, string>,
): void {
  const cfq = (window as unknown as { cfq?: { sendEvent?: (e: string, p?: unknown) => void } }).cfq;
  cfq?.sendEvent?.(event, props);
}
