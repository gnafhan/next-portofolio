import {
  Activity,
  ChartColumn,
  ClipboardCheck,
  House,
  Inbox,
  MessageSquareText,
  Sparkles,
  UtensilsCrossed,
  Wallet,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  wallet: Wallet,
  inbox: Inbox,
  pulse: Activity,
  plate: UtensilsCrossed,
  check: ClipboardCheck,
  home: House,
  chat: MessageSquareText,
  chart: ChartColumn,
  flow: Workflow,
  spark: Sparkles,
};

export const iconNames = Object.keys(ICONS);

export function Glyph({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon size={size} strokeWidth={1.75} className={className} aria-hidden />;
}

export const LOGO_PATHS: { fill: string; d: string }[] = [
  { fill: "#f8b916", d: "M393.29,167.79c-.27,4.22-1.21,8.48-2.87,12.62l-69.46,172.75c-8.38,20.85-32.08,30.95-52.93,22.58-20.86-8.38-30.97-32.08-22.58-52.93l69.46-172.76c8.38-20.85,32.08-30.95,52.93-22.57,16.71,6.72,26.52,23.27,25.45,40.32Z" },
  { fill: "#e94436", d: "M149.42,120.76c18.99-12.02,44.13-6.38,56.15,12.6l114.86,181.32c12.03,18.99,6.38,44.13-12.6,56.15l-3.07,1.95c-18.98,12.03-44.12,6.39-56.15-12.6l-114.86-181.33c-12.02-18.98-6.38-44.12,12.6-56.15l3.07-1.95Z" },
  { fill: "#557cbe", d: "M210.62,154.45c-.27,4.22-1.2,8.48-2.87,12.62l-69.46,172.75c-8.38,20.85-32.08,30.95-52.93,22.58-20.86-8.38-30.96-32.08-22.58-52.93l69.46-172.76c8.38-20.85,32.08-30.95,52.93-22.57,16.71,6.72,26.52,23.27,25.45,40.31Z" },
  { fill: "#286eb5", d: "M176.49,246.12l31.68-78.3c8.47-20.93-1.64-44.77-22.57-53.23-10.42-4.22-21.56-3.83-31.17,.21l-10.72,6.6c-4.84,4.13-8.8,9.44-11.35,15.75l-9.13,22.57,53.26,86.39Z" },
  { fill: "#e02926", d: "M321.45,316.64l-45.02-71.07-38.91,96.78,12.41,19.59c11.38,17.96,35.16,23.3,53.13,11.92l6.47-4.1c17.96-11.38,23.3-35.16,11.92-53.13Z" },
];

/** The "N" mark (three strokes: blue, red, yellow). */
export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="58 104 340 290" width={size} height={(size * 290) / 340} className={className} aria-hidden>
      {LOGO_PATHS.map((p) => (
        <path key={p.d.slice(0, 12)} fill={p.fill} d={p.d} />
      ))}
    </svg>
  );
}

export type Tone = "blue" | "green" | "orange" | "violet";

/** App-style icon: flat squircle with a white glyph. */
export function IconTile({ name, size = 56, tone = "blue" }: { name: string; size?: number; tone?: Tone }) {
  return (
    <span className={`app-icon app-icon-${tone}`} style={{ width: size, height: size, borderRadius: size * 0.26 }}>
      <Glyph name={name} size={Math.round(size * 0.5)} />
    </span>
  );
}
