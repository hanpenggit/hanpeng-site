/** Verify a single-use Turnstile token server-side before any billable call. */
export async function verifyTurnstile(
  token: string,
  secret: string,
  hostname: string,
  remoteIp: string | null,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  if (!secret || !hostname || !token) return false;
  const data = new URLSearchParams({ secret, response: token });
  if (remoteIp) data.set("remoteip", remoteIp);
  try {
    const response = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString(),
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    if (!response.ok) return false;
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object") return false;
    const result = payload as Record<string, unknown>;
    return result.success === true && result.hostname === hostname && result.action === "portfolio_chat";
  } catch {
    // Do not log the response, token or secret, even for upstream errors.
    return false;
  }
}
