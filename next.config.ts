import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Dev-only: other machines on the LAN open the dev server via this host, and
  // Next 16 blocks cross-origin dev requests — including the HMR WebSocket —
  // unless the host is allow-listed here. Add/replace your LAN IP if it changes.
  allowedDevOrigins: ["192.168.3.59"],
  images: {
    // Next 16 only allows quality 75 by default; the hero headshot asks for 92
    // so it stays sharp on retina screens.
    qualities: [75, 92],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
