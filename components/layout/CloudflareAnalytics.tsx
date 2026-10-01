import Script from "next/script";

// Cloudflare Web Analytics beacon — cookieless, no consent banner needed.
// Renders only when NEXT_PUBLIC_CF_BEACON_TOKEN is set, so localhost and
// preview builds stay out of the numbers.
//
// Note: the beacon reports page views + Core Web Vitals only. Button clicks go
// through lib/analytics.ts (Zaraz or /api/event), not through here.
export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  if (!token) return null;
  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${token}"}`}
      strategy="afterInteractive"
    />
  );
}
