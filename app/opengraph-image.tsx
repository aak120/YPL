import { ImageResponse } from "next/og";

export const alt = "Youth Policy Lab — Ideas into Policy. Research into Impact.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0c1a2e", color: "#f7f5f0", padding: 80, fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 30 }}>
          <div style={{ width: 56, height: 56, border: "2px solid #f7f5f0", display: "flex" }} />
          Youth Policy Lab
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.02, letterSpacing: -2 }}>
          <span>Ideas into Policy.</span>
          <span style={{ color: "#9fd0cc", fontStyle: "italic" }}>Research into Impact.</span>
        </div>
        <div style={{ fontSize: 24, color: "#9aa7b8", fontFamily: "sans-serif" }}>A youth-led policy research initiative · Open-access research</div>
      </div>
    ),
    size,
  );
}
