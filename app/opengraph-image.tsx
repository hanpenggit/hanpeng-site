import { ImageResponse } from "next/og";
import { profile } from "@/lib/profile";
import { getSiteUrl } from "@/lib/site";

export const runtime = "edge";
export const alt = `${profile.identity.name} — ${profile.identity.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og ships a Latin-only font, so Chinese renders as tofu boxes unless we
// hand satori a CJK face. Google's css2 API serves .ttf to browsers that don't
// advertise woff2 — that's the trick used below. Cached per isolate, and the
// route degrades to the built-in font if either fetch fails.
let cjkFont: ArrayBuffer | null | undefined;

async function loadCjkFont(): Promise<ArrayBuffer | null> {
  if (cjkFont !== undefined) return cjkFont;
  let font: ArrayBuffer | null = null;
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap",
      // An old UA makes Google serve truetype instead of woff2 (satori can't
      // decode woff2).
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64)" } },
    ).then((r) => r.text());
    const url = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/)?.[1];
    font = url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    font = null;
  }
  cjkFont = font;
  return font;
}

export default async function OpengraphImage() {
  const { identity } = profile;
  const host = new URL(getSiteUrl()).host;
  const font = await loadCjkFont();
  const firstProject = profile.projects[0];

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
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {identity.name.slice(0, 1)}
          </div>
          <div style={{ fontSize: 26, color: "#9AA7BD" }}>{host}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-3px" }}>
            {identity.name}
          </div>
          <div style={{ fontSize: 36, color: "#9AA7BD", maxWidth: 900 }}>
            {identity.taglineLead}
            {identity.taglineAccent}
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
            {identity.availability}
          </div>
          <div style={{ fontSize: 26, color: "#9AA7BD" }}>
            {firstProject ? `${firstProject.name} · ${firstProject.metric}` : identity.title}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [
            { name: "sans-serif", data: font, weight: 400 as const, style: "normal" as const },
            { name: "sans-serif", data: font, weight: 700 as const, style: "normal" as const },
          ]
        : undefined,
    },
  );
}
