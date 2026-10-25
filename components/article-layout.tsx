import { IconTile } from "./pixel-icon";
import { Toc } from "./toc";
import { Share } from "./share";
import type { Heading } from "@/lib/content";

export type MetaItem = { label: string; value: React.ReactNode };

export function ArticleLayout({
  icon,
  tone,
  kicker,
  title,
  description,
  meta,
  headings,
  minutes,
  url,
  markdownUrl,
  children,
  footer,
}: {
  icon: string;
  tone?: "accent" | "sage" | "sand" | "rose";
  kicker?: React.ReactNode;
  title: string;
  description: string;
  meta: MetaItem[];
  headings: Heading[];
  minutes: number;
  url: string;
  markdownUrl?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <header className="mx-auto max-w-[44rem] pb-12 pt-14 sm:pt-20">
        <IconTile name={icon} tone={tone} size={64} />
        {kicker && <div className="mt-6">{kicker}</div>}
        <h1 className="mt-4 text-[2rem] font-semibold leading-[1.15] tracking-tight sm:text-[2.5rem]">{title}</h1>
        <p className="mt-4 text-[1.1rem] leading-relaxed text-ink-2">{description}</p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="label">{m.label}</dt>
              <dd className="mt-1.5 flex gap-2 text-[0.92rem]">
                <span aria-hidden className="font-mono text-ink-3">└</span>
                <span>{m.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      </header>
      <div className="border-t border-line" />
      <div className="relative grid gap-10 pt-12 lg:grid-cols-[13rem_minmax(0,44rem)_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-10">
            <Toc headings={headings} minutes={minutes} />
            <Share url={url} title={title} markdownUrl={markdownUrl} />
          </div>
        </aside>
        <div className="min-w-0">
          <article className="article prose">{children}</article>
          <div className="mt-14 border-t border-line pt-8 lg:hidden">
            <Share url={url} title={title} markdownUrl={markdownUrl} />
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
}
