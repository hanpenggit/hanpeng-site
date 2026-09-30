import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Per-IP sliding-window limiter for the public chatbot endpoint.
// If Upstash env vars are absent (e.g. local dev) the limiter no-ops and never
// blocks — but in production these MUST be set: a public live key without a
// limiter is a billing incident waiting to happen.
const hasRedis =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimiter = hasRedis
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "5 m"), // 10 messages / IP / 5 min (recovers continuously)
      prefix: "asksahil",
      analytics: false,
    })
  : null;

export const rateLimitEnabled = hasRedis;

export async function limit(id: string): Promise<{ success: boolean }> {
  if (!ratelimiter) return { success: true };
  try {
    const { success } = await ratelimiter.limit(id);
    return { success };
  } catch {
    // Never let a limiter outage take down the endpoint — fail open.
    return { success: true };
  }
}
