import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type CfLimiter = { limit(args: { key: string }): Promise<{ success: boolean }> };

/** The Cloudflare binding is a *per-PoP approximate limit*, not a global budget. */
function cloudflareLimiter(): CfLimiter | null {
  try {
    const context = getCloudflareContext();
    const env = context.env as typeof context.env & { CHAT_RATE_LIMIT?: CfLimiter };
    return env.CHAT_RATE_LIMIT ?? null;
  } catch {
    // `next dev` runs outside the Workers runtime.
    return null;
  }
}

function redisLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, "5 m"),
    prefix: "hanpeng-site:chat:v2",
    analytics: false,
  });
}

export function hasChatLimiter(): boolean {
  return Boolean(cloudflareLimiter() || (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN));
}

/** Cheap preflight, before the challenge verification. */
export async function limitEdge(id: string): Promise<boolean> {
  const binding = cloudflareLimiter();
  if (!binding) return Boolean(redisLimiter()); // The global limiter will run below.
  try {
    return (await binding.limit({ key: `chat:${id}` })).success;
  } catch {
    return false;
  }
}

/** Optional globally distributed secondary limit; fail-closed on Redis outage. */
export async function limitGlobal(id: string): Promise<boolean> {
  const limiter = redisLimiter();
  if (!limiter) return Boolean(cloudflareLimiter());
  try {
    return (await limiter.limit(id)).success;
  } catch {
    return false;
  }
}
