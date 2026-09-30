// Decorative, non-interactive background layers from the design:
// radial brand/pass glows + a dotted grid, a top vignette, and a faint
// scanline overlay (opacity driven by --scan). All aria-hidden.
export function Background() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: `
            radial-gradient(900px 600px at 82% -8%, color-mix(in srgb, var(--brand) 22%, transparent), transparent 60%),
            radial-gradient(700px 520px at -6% 18%, color-mix(in srgb, var(--pass) 14%, transparent), transparent 60%),
            radial-gradient(circle, color-mix(in srgb, var(--text-lo) 28%, transparent) 1px, transparent 1px),
            var(--bg)`,
          backgroundSize: "100% 100%, 100% 100%, 28px 28px",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 55%, var(--bg) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: 60,
          opacity: "var(--scan)",
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,.5) 0, rgba(255,255,255,.5) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />
    </>
  );
}
