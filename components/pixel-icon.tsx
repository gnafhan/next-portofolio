export const GRIDS: Record<string, string[]> = {
  logo: ["X.....X", "XX....X", "X.X...X", "X..X..X", "X...X.X", "X....XX", "X.....X"],
  wallet: [".........", ".XXXXXXX.", "X.......X", "X....XXXX", "X...X...X", "X...X.X.X", "X....XXXX", "X.......X", ".XXXXXXX."],
  inbox: ["..XXXXX..", "..X...X..", "..X.X.X..", "..X...X..", "X.......X", "X.......X", "XXX...XXX", "X..XXX..X", "XXXXXXXXX"],
  pulse: [".........", "....X....", "....XX...", "...X.X...", "XXXX.X.XX", ".....XX..", "......X..", ".........", "........."],
  plate: [".........", "...X.X...", "..X.X....", ".........", "XXXXXXXXX", "X.......X", ".X.....X.", "..XXXXX..", "........."],
  check: ["XXXXXXXXX", "X.......X", "X.....X.X", "X....X..X", "X.X.X...X", "X..X....X", "X.......X", "XXXXXXXXX", "........."],
  home: ["....X....", "...XXX...", "..XX.XX..", ".XX...XX.", "XXX...XXX", ".X.....X.", ".X.XXX.X.", ".X.X.X.X.", ".XXX.XXX."],
  chat: ["XXXXXXXXX", "X.......X", "X.XX.XX.X", "X.......X", "X.XXXX..X", "X.......X", "XXXXXXXXX", ".XX......", ".X......."],
  chart: ["X........", "X......X.", "X......X.", "X...X..X.", "X...X..X.", "X.X.X..X.", "X.X.X.XX.", "X.X.X.XX.", "XXXXXXXXX"],
  flow: ["XXX......", "X.X......", "XXX......", ".X.......", ".XXXXX...", ".....X...", "....XXX..", "....X.X..", "....XXX.."],
  spark: ["....X....", "....X....", "...X.X...", "XXX...XXX", "...X.X...", "....X....", "....X....", ".........", "........."],
};

export const iconNames = Object.keys(GRIDS).filter((k) => k !== "logo");

export function PixelIcon({
  name,
  size = 32,
  className,
  title,
}: {
  name: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const grid = GRIDS[name] ?? GRIDS.spark;
  const n = grid.length;
  const rects: React.ReactNode[] = [];
  grid.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c === "X") rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} />);
    }),
  );
  return (
    <svg
      viewBox={`0 0 ${n} ${n}`}
      width={size}
      height={size}
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {rects}
    </svg>
  );
}

/** Square tile with a pixel icon, used as the "cover" of posts and case studies. */
export function IconTile({ name, size = 56, tone = "accent" }: { name: string; size?: number; tone?: "accent" | "sage" | "sand" | "rose" }) {
  const tones = {
    accent: "bg-accent text-accent-ink",
    sage: "bg-sage text-sage-ink",
    sand: "bg-sand text-sand-ink",
    rose: "bg-rose text-rose-ink",
  } as const;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[6px] ${tones[tone]}`}
      style={{ width: size, height: size }}
    >
      <PixelIcon name={name} size={Math.round(size * 0.56)} />
    </span>
  );
}
