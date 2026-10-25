import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { GRIDS } from "@/components/pixel-icon";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = path.join(process.cwd(), "assets/fonts");

function Pixels({ name, size, color }: { name: string; size: number; color: string }) {
  const grid = GRIDS[name] ?? GRIDS.spark;
  const n = grid.length;
  const cell = size / n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {grid.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "X" ? <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell + 0.5} height={cell + 0.5} fill={color} /> : null,
        ),
      )}
    </svg>
  );
}

export async function renderOg({ kicker, title, description, icon = "logo" }: { kicker: string; title: string; description?: string; icon?: string }) {
  const [regular, semibold, mono] = await Promise.all([
    readFile(path.join(fontDir, "Geist-Regular.ttf")),
    readFile(path.join(fontDir, "Geist-SemiBold.ttf")),
    readFile(path.join(fontDir, "GeistMono-Regular.ttf")),
  ]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#faf9f5", padding: 72, fontFamily: "Geist" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", width: 104, height: 104, background: "#3355d1", borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
            <Pixels name={icon} size={58} color="#ffffff" />
          </div>
          <div style={{ fontFamily: "Geist Mono", fontSize: 24, color: "#8c8a82", letterSpacing: 2, textTransform: "uppercase" }}>{kicker}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div style={{ fontSize: title.length > 60 ? 56 : 68, fontWeight: 600, color: "#161614", lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</div>
          {description && (
            <div style={{ fontSize: 28, color: "#57564f", marginTop: 24, lineHeight: 1.4, maxWidth: 980 }}>
              {description.length > 150 ? `${description.slice(0, 147)}…` : description}
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "2px solid #e5e2d8", fontFamily: "Geist Mono", fontSize: 24, color: "#57564f" }}>
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
