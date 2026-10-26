import Link from "next/link";
import { site, nav } from "@/lib/site";
import { Logo } from "./icons";
import { FooterWordmark } from "./footer-wordmark";

/** Deterministic scatter of faint dots for the footer background (same on server and client). */
function dotField(count: number, w: number, h: number) {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: count }, () => ({ x: rand() * w, y: rand() * h, r: rand() < 0.15 ? 1.6 : 0.9 }));
}

const DOTS = dotField(140, 1200, 420);

export function SiteFooter({ year }: { year: number }) {
  const elsewhere = [
    { label: "GitHub", href: site.links.github },
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "Email", href: `mailto:${site.email}` },
    { label: "RSS", href: "/rss.xml" },
  ];
  return (
    <footer data-agent="contact" className="relative mt-32 overflow-hidden border-t border-line">
      {/* faint scattered dots behind everything */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 420" aria-hidden>
        {DOTS.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            className={`fill-[var(--ink-3)] ${i % 5 === 0 ? "star-twinkle" : ""}`}
            opacity={0.35}
            style={i % 5 === 0 ? { animationDelay: `${-(i % 13) * 0.37}s`, animationDuration: `${3 + (i % 4)}s` } : undefined}
          />
        ))}
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div>
            <Logo size={28} />
            <p className="mt-4 max-w-[30ch] text-[1.05rem] leading-snug text-ink">{site.headline}</p>
            <a href={`mailto:${site.email}`} className="mt-4 inline-block text-[0.95rem] text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">
              {site.email}
            </a>
          </div>
          <div>
            <div className="label">Site</div>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="text-[0.98rem] hover:text-accent">Home</Link>
              </li>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-[0.98rem] hover:text-accent">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label">Elsewhere</div>
            <ul className="mt-3 space-y-2">
              {elsewhere.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[0.98rem] hover:text-accent" {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                    {l.label}
                    {l.href.startsWith("http") ? " ↗" : ""}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-start lg:justify-end">
            <a href="#main" className="lg rounded-full px-4 py-2 text-[0.88rem] text-ink-2 hover:text-ink">
              Back to top ↑
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-5 text-[0.85rem] text-ink-3">
          <span>
            © {year} {site.name}
          </span>
          <span>Made in {site.location}</span>
        </div>
      </div>

      {/* giant halftone wordmark, cropped by the bottom edge */}
      <FooterWordmark />
    </footer>
  );
}
