import Image from "next/image";
import { profile } from "@/lib/profile";

// 韩鹏's avatar for "问问 韩鹏" — a circular crop of the same headshot used in
// the hero, so the bot and the page read as the same person. (It used to point
// at the template author's memoji.)
export function Avatar({
  size = 34,
  done = false,
}: {
  size?: number;
  done?: boolean;
}) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <Image
        src="/hanpeng.jpg"
        alt={profile.identity.name}
        fill
        sizes={`${size}px`}
        style={{
          objectFit: "cover",
          borderRadius: "50%",
          border: done ? "1.5px solid var(--pass)" : "1px solid var(--line)",
        }}
      />
    </span>
  );
}

