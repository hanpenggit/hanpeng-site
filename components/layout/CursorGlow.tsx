"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = 'a,button,[role="button"],summary,label[for]';

// A soft light pinned exactly to the pointer, sitting at the same z-index as
// the other decorative background layers so it never covers content. The OS
// cursor is left alone. Two nested elements on purpose: the outer one carries
// position (written straight from the mouse event, no interpolation) and the
// inner one carries the hover pulse, so the two never fight over `transform`.
// Desktop / fine-pointer only, off under reduced motion.
export function CursorGlow() {
  const posRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const pos = posRef.current;
    const core = coreRef.current;
    if (!pos || !core) return;

    let shown = false;

    const onMove = (e: MouseEvent) => {
      pos.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!shown) {
        shown = true;
        pos.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const hot = (e.target as HTMLElement)?.closest?.(INTERACTIVE);
      core.dataset.hot = hot ? "true" : "false";
    };
    const onLeave = () => {
      shown = false;
      pos.style.opacity = "0";
      core.dataset.hot = "false";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={posRef} className="cursor-glow" aria-hidden="true">
      <div ref={coreRef} className="cursor-glow-core" data-hot="false" />
    </div>
  );
}
