import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { JsonLd } from "@/components/json-ld";
import { Mdx } from "@/lib/mdx";
import { getAllWork, getWork } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { toneFor } from "@/lib/tone";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllWork().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};
  return {
    title: `${work.title} · Case study`,
    description: work.summary,
    keywords: work.stack,
    alternates: { canonical: `/work/${work.slug}` },
    openGraph: { type: "article", url: `/work/${work.slug}`, title: work.title, description: work.summary },
    twitter: { card: "summary_large_image", title: work.title, description: work.summary },
  };
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();
  const all = getAllWork();
  const next = all[(all.findIndex((w) => w.slug === work.slug) + 1) % all.length];
  const url = absoluteUrl(`/work/${work.slug}`);

  return (
    <>
      <ArticleLayout
        icon={work.icon}
        tone={toneFor(work.order)}
        kicker={<Link href="/work" className="label hover:text-ink">← Work · Case study</Link>}
        title={work.title}
        description={work.summary}
        meta={[
          { label: "Role", value: work.role },
          { label: "When", value: work.period },
          { label: "Stack", value: work.stack.slice(0, 4).join(", ") },
        ]}
        headings={work.headings}
        minutes={work.readingMinutes}
        url={url}
        markdownUrl={`/work/${work.slug}/raw.md`}
        footer={
          <div className="mt-12 space-y-6">
            {work.stack.length > 0 && (
              <div>
                <div className="label mb-3">Built with</div>
                <ul className="flex flex-wrap gap-2">
                  {work.stack.map((s) => (
                    <li key={s} className="glass rounded-full px-3 py-1 text-[0.78rem] text-ink-2">{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {work.links.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {work.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener" className="text-[0.9rem] text-accent hover:underline">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
            {next && next.slug !== work.slug && (
              <Link href={`/work/${next.slug}`} className="glass glass-hover block rounded-[20px] p-4">
                <div className="label">Next case study</div>
                <div className="mt-1 font-medium">{next.title}</div>
              </Link>
            )}
          </div>
        }
      >
        <Mdx source={work.body} />
      </ArticleLayout>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: work.title,
          description: work.summary,
          url,
          creator: { "@id": absoluteUrl("/#person") },
          keywords: work.stack.join(", "),
          image: absoluteUrl(`/work/${work.slug}/opengraph-image`),
        }}
      />
    </>
  );
}
