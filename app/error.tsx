"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: 1120,
        margin: "0 auto",
        padding: "0 32px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: "var(--pass)",
          marginBottom: 14,
        }}
      >
        error
      </div>
      <h1
        style={{
          fontFamily: "var(--display)",
          fontWeight: 400,
          fontSize: "clamp(32px, 5vw, 46px)",
          letterSpacing: "-.01em",
          marginBottom: 14,
        }}
      >
        页面加载出错了
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-lo)", maxWidth: "46ch" }}>
        刷新一下通常就好了；如果一直失败，麻烦把地址发给我，我来修。
      </p>
      <button
        onClick={reset}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginTop: 26,
          alignSelf: "flex-start",
          height: 46,
          padding: "0 22px",
          borderRadius: 999,
          border: "1px solid var(--line)",
          background: "var(--surface)",
          color: "var(--text-hi)",
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        重试
      </button>
    </main>
  );
}
