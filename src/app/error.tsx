"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "monospace",
        background: "#fbf4ea",
        color: "#2b241c",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 18, marginBottom: 12 }}>Something crashed</h1>
      <p style={{ fontSize: 13, marginBottom: 8, maxWidth: 500, wordBreak: "break-word" }}>
        {error.message}
      </p>
      {error.digest && (
        <p style={{ fontSize: 11, color: "#8a7c65", marginBottom: 16 }}>
          Digest: {error.digest}
        </p>
      )}
      <pre
        style={{
          fontSize: 10,
          textAlign: "left",
          maxWidth: 600,
          overflow: "auto",
          background: "#fff",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          whiteSpace: "pre-wrap",
        }}
      >
        {error.stack}
      </pre>
      <button
        onClick={reset}
        style={{
          padding: "8px 16px",
          borderRadius: 8,
          background: "#2d8ac0",
          color: "white",
          border: "none",
        }}
      >
        Try again
      </button>
    </div>
  );
}
