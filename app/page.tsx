import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { getAllPosts, getAllWork, getPage } from "@/lib/content";
import { site } from "@/lib/site";
import { focus } from "@/lib/profile";
import { Glyph, Logo } from "@/components/icons";
import { WorkCard, PostRow } from "@/components/cards";
import { Flow } from "@/components/mdx/flow";

export default function Home() {
  const work = getAllWork();
  const featured = work.filter((w) => w.featured).slice(0, 3);
  const posts = getAllPosts().slice(0, 4);
  const now = getPage("now").data as { highlights: string[] };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="flex flex-col items-center pb-14 pt-16 text-center sm:pb-20 sm:pt-24">
        <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.85rem] text-ink-2">
          <Sparkles size={15} className="text-accent" aria-hidden />
          AI engineer · full-stack · {site.location}
        </span>
        <h1 className="mt-7 max-w-[16ch] text-[2.7rem] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[4.4rem]">
          AI systems that{" "}
          <span className="bg-gradient-to-r from-[#2997ff] via-[#5e8bff] to-[#8f6bff] bg-clip-text text-transparent">actually get used.</span>
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.1rem] leading-relaxed text-ink-2">
          I&apos;m {site.name}, a software engineer who ships AI features into messy, real-world workflows, and does the
          full stack around them: data pipelines, backend, evals and the UI people actually touch.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/work" className="btn btn-primary">
            See case studies <ArrowRight size={16} aria-hidden />
          </Link>
          <Link href="/blog" className="btn glass glass-hover">Read the blog</Link>
        </div>
      </section>

      {/* Bento */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass tint-blue rounded-[28px] p-6 sm:p-7 lg:row-span-2">
          <div className="label">How I build AI features</div>
          <div className="mt-6">
            <Flow
              compact
              items={[
                { label: "Messy input", note: "chat, photos, voice, spreadsheets", kind: "check" },
                { label: "Model decides", note: "what the user means, which tool to call", kind: "auto" },
                { label: "Code does the math", note: "queries, money and writes stay deterministic", kind: "auto" },
                { label: "Evals gate it", note: "scenarios run on every change", kind: "auto" },
                { label: "A person approves", note: "where mistakes are expensive", kind: "human" },
              ]}
            />
          </div>
        </div>

        {featured.slice(0, 2).map((w) => (
          <WorkCard key={w.slug} work={w} large />
        ))}

        <Link href="/now" className="glass glass-hover tint-warm group flex flex-col rounded-[28px] p-6 sm:p-7 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="label">Now</span>
            <span className="glass flex size-9 items-center justify-center rounded-full text-ink-3 group-hover:text-ink">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {now.highlights.map((h) => (
              <li key={h} className="text-[1rem] leading-snug">{h}</li>
            ))}
          </ul>
        </Link>

        <div className="glass rounded-[28px] p-6 sm:p-7 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="label">Latest writing</span>
            <Link href="/blog" className="text-[0.85rem] text-ink-2 hover:text-ink">All posts →</Link>
          </div>
          <div className="mt-2">
            {posts.length ? posts.map((p) => <PostRow key={p.slug} post={p} />) : (
              <p className="py-6 text-ink-2">First posts are on the way.</p>
            )}
          </div>
        </div>

        {featured[2] && <WorkCard work={featured[2]} />}

        <div className="glass tint-green rounded-[28px] p-6 sm:p-7">
          <span className="label">What I work with</span>
          <ul className="mt-5 flex flex-wrap gap-2">
            {focus.map((f) => (
              <li key={f} className="glass rounded-full px-3 py-1 text-[0.85rem]">{f}</li>
            ))}
          </ul>
        </div>

        <Link href="/work" className="glass glass-hover tint-blue group flex flex-col justify-between rounded-[28px] p-6 sm:p-7">
          <span className="label">Work</span>
          <div className="mt-6">
            <div className="flex gap-2 text-accent">
              {work.slice(0, 6).map((w) => <Glyph key={w.slug} name={w.icon} size={20} />)}
            </div>
            <p className="mt-4 text-[1.15rem] font-semibold leading-snug">{work.length} case studies, from finance-by-chat to outbreak response.</p>
            <span className="mt-3 inline-block text-[0.85rem] text-accent group-hover:underline">Browse all →</span>
          </div>
        </Link>

        <div className="glass flex flex-col justify-between rounded-[28px] p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <span className="label">Elsewhere</span>
            <Logo size={22} />
          </div>
          <ul className="mt-6 space-y-2 text-[0.92rem]">
            <li><a href={site.links.github} className="hover:text-accent" target="_blank" rel="noopener">GitHub ↗</a></li>
            <li><a href={site.links.linkedin} className="hover:text-accent" target="_blank" rel="noopener">LinkedIn ↗</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-accent">{site.email}</a></li>
            <li><Link href="/rss.xml" className="hover:text-accent">RSS feed</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
