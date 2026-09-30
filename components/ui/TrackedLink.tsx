"use client";

import type { CSSProperties, ReactNode } from "react";
import { logEvent, type AnalyticsEvent } from "@/lib/analytics";

export function TrackedLink({
  href,
  event,
  children,
  className,
  style,
  ariaLabel,
  newTab,
  download,
}: {
  href: string;
  event: AnalyticsEvent;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  newTab?: boolean;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={() => logEvent(event)}
      className={className}
      style={style}
      aria-label={ariaLabel}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: true } : {})}
    >
      {children}
    </a>
  );
}
