import type { Metadata, Viewport } from "next";
import {
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Background } from "@/components/layout/Background";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { CloudflareAnalytics } from "@/components/layout/CloudflareAnalytics";
import { profile } from "@/lib/profile";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const { identity } = profile;
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${identity.name} — ${identity.title}`,
    template: `%s · ${identity.name}`,
  },
  description: identity.summary,
  applicationName: `${identity.name} — Portfolio`,
  authors: [{ name: identity.name, url: siteUrl }],
  creator: identity.name,
  keywords: [
    identity.name,
    "全栈开发工程师",
    "AI 工程师",
    "族记",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "RAG",
    "LLM",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: `${identity.name} — Portfolio`,
    title: `${identity.name} — ${identity.title}`,
    description: identity.heroSummary,
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} — ${identity.title}`,
    description: identity.heroSummary,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0F17" },
    { media: "(prefers-color-scheme: light)", color: "#F4F5F2" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: identity.title,
  description: identity.summary,
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: identity.location,
  },
  email: identity.links.email,
  sameAs: [
    identity.links.linkedin,
    identity.links.github,
    identity.links.youtube,
    identity.links.website,
  ].filter(Boolean),
  knowsAbout: profile.areasOfExpertise,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = `${inter.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`;
  return (
    <html lang="zh-CN" className={fontVars} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Background />
          {children}
          <CursorGlow />
        </ThemeProvider>
        <CloudflareAnalytics />
      </body>
    </html>
  );
}
