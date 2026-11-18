"use client";

// Shown when the root layout itself throws. It replaces the whole document, so
// it has its own <html> and <body> and cannot rely on the app's styles: the
// colors are written inline (Deep Ink, cream, gold).
export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0a0a09",
          color: "#f4eee3",
          fontFamily: "Georgia, serif",
        }}
      >
        <main role="alert" style={{ maxWidth: 440, padding: 24 }}>
          <h1 style={{ fontSize: 36, fontWeight: 400, margin: "0 0 12px" }}>
            Ada yang tidak beres.
          </h1>
          <p style={{ color: "#aaa49a", margin: "0 0 24px", lineHeight: 1.6 }}>
            Website Station Parfume gagal dimuat. Coba sekali lagi, atau kembali
            beberapa saat lagi.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              background: "#c8a15a",
              color: "#141110",
              border: 0,
              padding: "14px 24px",
              font: "600 12px system-ui, sans-serif",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Coba lagi
          </button>
        </main>
      </body>
    </html>
  );
}
