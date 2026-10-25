import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter({ year }: { year: number }) {
  const links = [
    { label: "GitHub", href: site.links.github },
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "Email", href: `mailto:${site.email}` },
    { label: "RSS", href: "/rss.xml" },
  ];
  return (
    <footer className="mt-24 px-3 pb-6 sm:px-6">
      <div className="glass mx-auto flex max-w-6xl flex-col gap-4 rounded-[28px] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.85rem] text-ink-3">
          © {year} {site.name} · {site.location}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="text-[0.85rem] text-ink-2 hover:text-ink">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
