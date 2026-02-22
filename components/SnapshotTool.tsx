"use client";

import { useState, useRef } from "react";

type Status = "idle" | "loading" | "success" | "error";

const S = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 16px",
    position: "relative" as const,
    overflow: "hidden",
    background: "#05050e",
    backgroundImage:
      "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
  },
  glow1: {
    position: "absolute" as const,
    width: 600,
    height: 600,
    top: "-20%",
    left: "-15%",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(79,255,176,0.07) 0%, transparent 70%)",
    pointerEvents: "none" as const,
    zIndex: 0,
  },
  glow2: {
    position: "absolute" as const,
    width: 500,
    height: 500,
    bottom: "-15%",
    right: "-12%",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(192,132,252,0.07) 0%, transparent 70%)",
    pointerEvents: "none" as const,
    zIndex: 0,
  },
  wrapper: {
    position: "relative" as const,
    zIndex: 1,
    width: "100%",
    maxWidth: 640,
    display: "flex",
    flexDirection: "column" as const,
    gap: 32,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 16px",
    borderRadius: 99,
    background: "rgba(16,16,31,0.8)",
    border: "1px solid rgba(79,255,176,0.2)",
    backdropFilter: "blur(20px)",
    color: "#4fffb0",
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.12em",
    fontWeight: 500,
    marginBottom: 20,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#4fffb0",
    flexShrink: 0,
  },
  h1: {
    fontSize: "clamp(2.4rem, 8vw, 3.8rem)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    marginBottom: 10,
    fontFamily: "'Syne', sans-serif",
  },
  h1Shimmer: {
    background: "linear-gradient(90deg, #4fffb0 0%, #c084fc 50%, #4fffb0 100%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "shimmer 4s linear infinite",
  },
  subtitle: {
    color: "#5b6378",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    lineHeight: 1.6,
  },
  card: {
    background: "rgba(16,16,31,0.75)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(79,255,176,0.18)",
    borderRadius: 20,
    padding: "28px 28px",
    boxShadow:
      "0 0 40px rgba(79,255,176,0.05), inset 0 0 40px rgba(79,255,176,0.02)",
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  },
  label: {
    fontSize: 10,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#4fffb0",
    marginBottom: 4,
    fontWeight: 500,
  },
  inputRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap" as const,
  },
  inputWrap: {
    flex: 1,
    minWidth: 200,
    position: "relative" as const,
  },
  prefix: {
    position: "absolute" as const,
    left: 16,
    top: "50%",
    transform: "translateY(-50%)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    color: "#5b6378",
    pointerEvents: "none" as const,
    userSelect: "none" as const,
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "14px 16px 14px 74px",
    color: "#ededfa",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.25s, box-shadow 0.25s",
  },
  btnCapture: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "14px 26px",
    borderRadius: 12,
    background: "rgba(79,255,176,0.08)",
    border: "1px solid rgba(79,255,176,0.32)",
    color: "#4fffb0",
    fontFamily: "'Syne', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
    whiteSpace: "nowrap" as const,
    position: "relative" as const,
    overflow: "hidden" as const,
  },
  progressWrap: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  },
  progressMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "#5b6378",
  },
  progressTrack: {
    height: 3,
    borderRadius: 99,
    background: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  progressHint: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "#5b6378",
  },
  errorBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "12px 16px",
    borderRadius: 12,
    background: "rgba(249,115,22,0.08)",
    border: "1px solid rgba(249,115,22,0.22)",
    color: "#f97316",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
  },
  resultCard: {
    background: "rgba(16,16,31,0.75)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(79,255,176,0.18)",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 0 40px rgba(79,255,176,0.06)",
  },
  browserBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(10,10,20,0.6)",
  },
  trafficDots: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  imgWrap: {
    position: "relative" as const,
    overflow: "hidden",
    maxHeight: 360,
  },
  imgOverlay: {
    position: "absolute" as const,
    inset: 0,
    background: "rgba(5,5,14,0.65)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s",
  },
  actionRow: {
    display: "flex",
    gap: 12,
    padding: "16px 20px",
    flexWrap: "wrap" as const,
  },
  btnDownload: {
    flex: 1,
    minWidth: 140,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 20px",
    borderRadius: 12,
    background: "rgba(79,255,176,0.08)",
    border: "1px solid rgba(79,255,176,0.32)",
    color: "#4fffb0",
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  btnReset: {
    flex: 1,
    minWidth: 140,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 20px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#5b6378",
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  filename: {
    padding: "0 20px 14px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "#374151",
  },
  footer: {
    textAlign: "center" as const,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "#374151",
  },
};

export default function SnapshotTool() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<{
    image: string;
    filename: string;
    hostname: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [hoverImg, setHoverImg] = useState(false);
  const [hoverDl, setHoverDl] = useState(false);
  const [hoverReset, setHoverReset] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgress = () => {
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 88) {
          clearInterval(progressRef.current!);
          return 88;
        }
        return p + Math.random() * 5 + 1;
      });
    }, 350);
  };

  const stopProgress = (ok: boolean) => {
    clearInterval(progressRef.current!);
    setProgress(ok ? 100 : 0);
  };

  const handleCapture = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    setStatus("loading");
    setError("");
    setResult(null);
    startProgress();
    try {
      const res = await fetch("/api/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal nih");
      stopProgress(true);
      setTimeout(() => {
        setResult(data);
        setStatus("success");
      }, 400);
    } catch (e: unknown) {
      stopProgress(false);
      setError(e instanceof Error ? e.message : "Error ga dikenal");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.image;
    a.download = result.filename;
    a.click();
  };

  const handleReset = () => {
    setStatus("idle");
    setResult(null);
    setError("");
    setUrl("");
    setProgress(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const isLoading = status === "loading";

  return (
    <main style={S.page}>
      <style>{`
        @keyframes shimmer { from { background-position: -200% center; } to { background-position: 200% center; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        .afu { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        .afi { animation: fadeIn 0.45s ease both; }
        .d1  { animation-delay: 0.1s; }
        .d2  { animation-delay: 0.2s; }
        .d3  { animation-delay: 0.3s; }
        .d4  { animation-delay: 0.4s; }
        .d5  { animation-delay: 0.55s; }
        .spin{ animation: spin 1s linear infinite; }
        .blink { animation: blink 1.5s ease infinite; }
        input::placeholder { color: #374151; }
      `}</style>

      <div style={S.glow1} />
      <div style={S.glow2} />

      <div style={S.wrapper}>
        <header className="afu" style={{ textAlign: "center" }}>
          <div style={S.badge}>
            <span style={S.dot} className="blink" />
            SNAPSHOT TOOL — v1.0
          </div>
          <h1 style={S.h1}>
            <span style={S.h1Shimmer}>Capture</span>{" "}
            <span style={{ color: "#ededfa" }}>the Web.</span>
          </h1>
          <p className="afu d2" style={S.subtitle}>
            screenshot website apapun dalam sekejap ⚡ no cap, fr fr 🔥
          </p>
        </header>

        <div className="afu d3" style={S.card}>
          <div style={S.label}>↓ masukin URL-nya</div>

          <div style={S.inputRow}>
            <div style={S.inputWrap}>
              <span style={S.prefix}>https://</span>
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCapture()}
                placeholder="example.com"
                disabled={isLoading}
                style={{
                  ...S.input,
                  borderColor: url
                    ? "rgba(79,255,176,0.35)"
                    : "rgba(255,255,255,0.08)",
                  boxShadow: url ? "0 0 0 1px rgba(79,255,176,0.12)" : "none",
                  opacity: isLoading ? 0.5 : 1,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(79,255,176,0.4)";
                  e.target.style.boxShadow = "0 0 0 1px rgba(79,255,176,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = url
                    ? "rgba(79,255,176,0.35)"
                    : "rgba(255,255,255,0.08)";
                }}
              />
            </div>

            <button
              onClick={handleCapture}
              disabled={isLoading || !url.trim()}
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              style={{
                ...S.btnCapture,
                borderColor:
                  hoverBtn && !isLoading
                    ? "rgba(79,255,176,0.6)"
                    : "rgba(79,255,176,0.32)",
                boxShadow:
                  hoverBtn && !isLoading
                    ? "0 0 32px rgba(79,255,176,0.2)"
                    : "none",
                transform:
                  hoverBtn && !isLoading ? "translateY(-2px)" : "translateY(0)",
                opacity: !url.trim() && !isLoading ? 0.45 : 1,
                cursor: isLoading || !url.trim() ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="spin"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Capturing...
                </>
              ) : (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Capture
                </>
              )}
            </button>
          </div>

          {isLoading && (
            <div className="afi" style={S.progressWrap}>
              <div style={S.progressMeta}>
                <span>🚀 Launching browser...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div style={S.progressTrack}>
                <div
                  style={{
                    height: "100%",
                    borderRadius: 99,
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #4fffb0, #c084fc)",
                    boxShadow: "0 0 12px rgba(79,255,176,0.5)",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <p style={S.progressHint}>⏳ sabar ya bro, bisa 10–20 detik...</p>
            </div>
          )}

          {status === "error" && (
            <div className="afi" style={S.errorBox}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {status === "success" && result && (
          <div className="afu d1" style={S.resultCard}>
            <div style={S.browserBar}>
              <div style={S.trafficDots}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#ff5f56",
                  }}
                />
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#febc2e",
                  }}
                />
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#28c840",
                  }}
                />
                <span
                  style={{
                    marginLeft: 8,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11,
                    color: "#5b6378",
                    maxWidth: 220,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {result.hostname}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#4fffb0",
                  }}
                  className="blink"
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 10,
                    color: "#4fffb0",
                  }}
                >
                  captured
                </span>
              </div>
            </div>

            <div
              style={S.imgWrap}
              onMouseEnter={() => setHoverImg(true)}
              onMouseLeave={() => setHoverImg(false)}
            >
              <img
                src={result.image}
                alt={`Screenshot ${result.hostname}`}
                style={{
                  width: "100%",
                  display: "block",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />
              <div style={{ ...S.imgOverlay, opacity: hoverImg ? 1 : 0 }}>
                <button
                  onClick={handleDownload}
                  style={{
                    ...S.btnDownload,
                    flex: "none",
                    background: "rgba(16,16,31,0.9)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download PNG
                </button>
              </div>
            </div>

            <div style={S.actionRow}>
              <button
                onClick={handleDownload}
                onMouseEnter={() => setHoverDl(true)}
                onMouseLeave={() => setHoverDl(false)}
                style={{
                  ...S.btnDownload,
                  borderColor: hoverDl
                    ? "rgba(79,255,176,0.6)"
                    : "rgba(79,255,176,0.32)",
                  boxShadow: hoverDl
                    ? "0 0 24px rgba(79,255,176,0.18)"
                    : "none",
                  transform: hoverDl ? "translateY(-1px)" : "none",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PNG
              </button>
              <button
                onClick={handleReset}
                onMouseEnter={() => setHoverReset(true)}
                onMouseLeave={() => setHoverReset(false)}
                style={{
                  ...S.btnReset,
                  borderColor: hoverReset
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(255,255,255,0.08)",
                  color: hoverReset ? "#ededfa" : "#5b6378",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.36" />
                </svg>
                Capture Lagi
              </button>
            </div>

            <div style={S.filename}>💾 {result.filename}</div>
          </div>
        )}

        <footer className="afu d5" style={S.footer}>
          built with ❤️ buat Nightfall — powered by puppeteer & next.js
        </footer>
      </div>
    </main>
  );
}
