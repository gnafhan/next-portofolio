import Image from "next/image";
import Link from "next/link";
import { getAllPosts, getAllWork, getPage } from "@/lib/content";
import { site } from "@/lib/site";
import { focus } from "@/lib/profile";
import { Glyph, Logo } from "@/components/icons";
import { WorkCard, PostRow } from "@/components/cards";
import { Flow } from "@/components/mdx/flow";
import portrait from "@/public/images/nafhan.png";

export default function Home() {
  const work = getAllWork();
  const featured = work.filter((w) => w.featured).slice(0, 3);
  const posts = getAllPosts().slice(0, 4);
  const now = getPage("now").data as { highlights: string[] };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Intro */}
        <div className="glass grid gap-6 rounded-[28px] p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-9 lg:col-span-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Logo size={26} />
              <span className="label">{site.name} · {site.location}</span>
            </div>
            <h1 className="mt-8 max-w-[18ch] text-[2.4rem] font-semibold leading-[1.05] tracking-tight sm:text-[3.2rem]">
              AI systems that actually get used.
            </h1>
            <p className="mt-6 max-w-[56ch] text-[1.06rem] leading-relaxed text-ink-2">
              I&apos;m a software engineer who ships AI features into messy, real-world workflows, and I do the
              full stack around them: data pipelines, backend, evals and the UI people actually touch.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/work" className="btn btn-primary">See case studies</Link>
              <Link href="/blog" className="btn glass glass-hover">Read the blog</Link>
              <a href={`mailto:${site.email}`} className="px-2 text-[0.92rem] text-ink-2 hover:text-ink">Email me →</a>
            </div>
          </div>
          <div className="order-first flex justify-center sm:order-none sm:items-end">
            <Image
              src={portrait}
              alt="Illustration of Ghifari Nafhan"
              priority
              sizes="(min-width: 640px) 240px, 180px"
              className="w-[180px] select-none sm:w-[240px]"
            />
          </div>
        </div>

        {/* Now */}
        <Link href="/now" className="glass glass-hover tint-warm group flex flex-col rounded-[28px] p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.72rem] uppercase tracking-wider opacity-75">[N] Now</span>
            <Glyph name="spark" size={20} />
          </div>
          <ul className="mt-6 space-y-3">
            {now.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-[0.98rem] leading-snug">
                <span aria-hidden className="font-mono opacity-60">└</span>
                {h}
              </li>
            ))}
          </ul>
          <span className="mt-auto pt-6 font-mono text-[0.72rem] uppercase tracking-wider opacity-75 group-hover:underline">
            What I&apos;m doing now →
          </span>
        </Link>

        {/* How I build */}
        <div className="glass rounded-[28px] p-6 sm:p-7">
          <div className="label">How I build AI features</div>
          <div className="mt-5">
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

        {/* Featured work */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {featured.slice(0, 2).map((w) => (
            <WorkCard key={w.slug} work={w} large />
          ))}
        </div>

        {/* Writing */}
        <div className="glass rounded-[28px] p-6 sm:p-7 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="label">[B] Latest writing</span>
            <Link href="/blog" className="font-mono text-[0.72rem] uppercase tracking-wider text-ink-3 hover:text-ink">All posts →</Link>
          </div>
          <div className="mt-2">
            {posts.length ? posts.map((p) => <PostRow key={p.slug} post={p} />) : (
              <p className="py-6 text-ink-2">First posts are on the way.</p>
            )}
          </div>
        </div>

        {featured[2] && <WorkCard work={featured[2]} />}

        {/* Focus */}
        <div className="glass tint-green rounded-[28px] p-6 sm:p-7">
          <span className="font-mono text-[0.72rem] uppercase tracking-wider opacity-75">What I work with</span>
          <ul className="mt-5 flex flex-wrap gap-2">
            {focus.map((f) => (
              <li key={f} className="rounded-full border border-current/25 px-3 py-1 text-[0.85rem]">{f}</li>
            ))}
          </ul>
        </div>

        {/* More work */}
        <Link href="/work" className="glass glass-hover tint-accent group flex flex-col justify-between rounded-[28px] p-6 sm:p-7">
          <span className="font-mono text-[0.72rem] uppercase tracking-wider opacity-80">[W] Work</span>
          <div className="mt-6">
            <div className="flex gap-2">
              {work.slice(0, 6).map((w) => <Glyph key={w.slug} name={w.icon} size={20} />)}
            </div>
            <p className="mt-4 text-[1.15rem] font-semibold leading-snug">{work.length} case studies, from finance-by-chat to outbreak response.</p>
            <span className="mt-3 inline-block font-mono text-[0.72rem] uppercase tracking-wider opacity-80 group-hover:underline">Browse all →</span>
          </div>
        </Link>

        {/* Links */}
        <div className="glass tint-ink flex flex-col justify-between rounded-[28px] p-6 sm:p-7">
          <span className="font-mono text-[0.72rem] uppercase tracking-wider opacity-70">Elsewhere</span>
          <ul className="mt-6 space-y-2 font-mono text-[0.85rem]">
            <li><a href={site.links.github} className="hover:underline" target="_blank" rel="noopener">GitHub ↗</a></li>
            <li><a href={site.links.linkedin} className="hover:underline" target="_blank" rel="noopener">LinkedIn ↗</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a></li>
            <li><Link href="/rss.xml" className="hover:underline">RSS feed</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
