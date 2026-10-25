import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { Logo } from "@/components/icons";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = path.join(process.cwd(), "assets/fonts");

export async function renderOg({ kicker, title, description }: { kicker: string; title: string; description?: string; icon?: string }) {
  const [regular, semibold, mono] = await Promise.all([
    readFile(path.join(fontDir, "Geist-Regular.ttf")),
    readFile(path.join(fontDir, "Geist-SemiBold.ttf")),
    readFile(path.join(fontDir, "GeistMono-Regular.ttf")),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#000",
          padding: 72,
          fontFamily: "Geist",
          color: "#f5f5f7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              width: 104,
              height: 104,
              borderRadius: 52,
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.22)",
            }}
          >
            <Logo size={58} />
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 22,
              color: "#d1d1d6",
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "12px 24px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {kicker}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div style={{ fontSize: title.length > 60 ? 56 : 70, fontWeight: 600, lineHeight: 1.06, letterSpacing: -2 }}>{title}</div>
          {description && (
            <div style={{ fontSize: 28, color: "#a1a1a6", marginTop: 24, lineHeight: 1.4, maxWidth: 1000 }}>
              {description.length > 150 ? `${description.slice(0, 147)}…` : description}
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 44, fontFamily: "Geist Mono", fontSize: 24, color: "#8e8e93" }}>
          <span>Ghifari Nafhan</span>
          <span>nafhan.com</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
