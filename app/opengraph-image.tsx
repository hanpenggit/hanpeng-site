import { ImageResponse } from "next/og";
import { profile } from "@/lib/profile";

export const runtime = "edge";
export const alt = `${profile.identity.name} — ${profile.identity.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { identity } = profile;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B0F17",
          backgroundImage:
            "radial-gradient(circle at 82% 0%, rgba(33,99,202,0.40), transparent 55%), radial-gradient(circle at 2% 32%, rgba(47,167,90,0.20), transparent 55%)",
          padding: "72px 80px",
          color: "#E8ECF3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#2163CA",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            SS
          </div>
          <div style={{ fontSize: 26, color: "#9AA7BD" }}>hanpeng.xyz</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-3px" }}>
            {identity.name}
          </div>
          <div style={{ fontSize: 36, color: "#9AA7BD", maxWidth: 900 }}>
            {`${identity.title} · QA automation, release quality & AI workflows`}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 22px",
              borderRadius: 999,
              border: "1px solid rgba(47,167,90,0.5)",
              background: "rgba(47,167,90,0.12)",
              fontSize: 28,
              color: "#2FA75A",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#2FA75A",
              }}
            />
            build: passing
          </div>
          <div style={{ fontSize: 26, color: "#9AA7BD" }}>
            {identity.availability.toLowerCase()}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
