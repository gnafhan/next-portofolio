import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts, getAllWork, getPage } from "@/lib/content";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { WorkCard, PostRow } from "@/components/cards";
import { TechStack } from "@/components/home/tech-stack";
import { LazyStory } from "@/components/lazy-visuals";
import { HeroArt } from "@/components/home/hero-art";
import { IntroReveal } from "@/components/home/intro-reveal";

export function generateMetadata(): Metadata {
  const hasPosts = getAllPosts().some((p) => !p.draft);
  return {
    title: { absolute: site.title },
    description: site.description,
    alternates: {
      canonical: "/",
      // Advertise the feed only once it has items.
      ...(hasPosts ? { types: { "application/rss+xml": [{ url: "/rss.xml", title: `${site.name} · Blog` }] } } : {}),
    },
    openGraph: { type: "website", url: "/", siteName: site.name, locale: "en_US", title: site.title, description: site.description },
    twitter: { card: "summary_large_image", title: site.title, description: site.description },
  };
}

const BENTO = [
  {
    pain: "Requests come in through WhatsApp, email, Slack and Discord, and some get forgotten.",
    title: "Every request, one to-do list",
    body: "An assistant reads those chats, rewrites each request as a clear task, and puts it on a single to-do list.",
    impact: "Nothing slips through the cracks",
    href: "/work/inbox-assistant",
    demo: <LazyStory name="OneBoardStory" />,
  },
  {
    pain: "Grading lab reports took three hours every single week.",
    title: "Hours of checking, done in minutes",
    body: "AI does the first pass against a clear rubric, flags what's missing, and the teacher makes the final call.",
    impact: "3 hours → 3 minutes of review a week",
    href: "/work/lab-report-grading-agent",
    demo: <LazyStory name="HoursToMinutesStory" />,
  },
  {
    pain: "Chatbots sound confident even when they make numbers up.",
    title: "Answers you can actually trust",
    body: "The AI understands the question, then looks up your real records instead of guessing the total.",
    impact: "Every number comes from your own data",
    href: "/work/catataja",
    demo: <LazyStory name="TrustedAnswerStory" />,
  },
  {
    pain: "Data typed by people is messy: dates, amounts and typos all over.",
    title: "From messy data to clear charts",
    body: "Pipelines clean every value, drop the rows that can't be trusted, and feed a dashboard people can read.",
    impact: "Decisions made on data you can check",
    href: "/work/outbreak-investigation-platform",
    demo: <LazyStory name="CleanDataStory" />,
  },
];

function SectionHead({ title, body, href, cta }: { title: string; body?: string; href?: string; cta?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-[1.9rem] font-medium tracking-tighter sm:text-[2.3rem]">{title}</h2>
        {body && <p className="mt-2 max-w-xl text-ink-2">{body}</p>}
      </div>
      {href && (
        <Link href={href} className="text-[0.95rem] text-ink-2 hover:text-ink">
          {cta} →
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const work = getAllWork();
  const posts = getAllPosts().slice(0, 3);
  const now = getPage("now").data as { highlights: string[] };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero: text left, portrait right (the 2024 layout) */}
      <IntroReveal />
      <section className="intro-parallax relative grid items-center gap-10 pb-10 pt-14 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:pt-24">
        <div className="order-2 md:order-1">
          <p className="text-[1.05rem] text-ink-2">Hi, I&apos;m {site.name}.</p>
          <h1 className="mt-3 text-[2.6rem] font-medium leading-[1.05] tracking-tighter sm:text-[3.6rem]">
            I build AI that turns hours of manual work into minutes.
          </h1>
          <p className="mt-5 max-w-[52ch] text-[1.08rem] leading-relaxed text-ink-2">
            Software engineer in {site.location}. I find the slow, repetitive parts of a workflow and automate them end to
            end, from the data pipeline to the screen people use.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/work" className="lg btn btn-primary">
              See my work <ArrowRight size={16} aria-hidden />
            </Link>
            <a href={site.links.linkedin} target="_blank" rel="noopener" className="lg btn">
              Connect on LinkedIn
            </a>
          </div>
        </div>
        <div className="order-1 flex justify-center md:order-2">
          <HeroArt />
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-12 sm:py-16">
        <TechStack />
      </section>

      {/* Bento: show, don't tell */}
      <section className="pt-10">
        <SectionHead title="What I build" body="Real problems, solved end to end. Each one is a project you can read about." />
        <div className="glass mt-8 grid overflow-hidden rounded-3xl md:grid-cols-2">
          {BENTO.map((b, i) => (
            <Link
              key={b.title}
              href={b.href}
              className={`group flex flex-col transition-colors hover:bg-ink/[0.02] ${i % 2 ? "md:border-l" : ""} ${i > 0 ? "border-t" : ""} ${i === 1 ? "md:border-t-0" : ""} border-line`}
            >
              <div className="relative h-[310px] overflow-hidden">{b.demo}</div>
              <div className="border-t border-line p-6">
                <p className="text-[0.88rem] text-ink-3">{b.pain}</p>
                <h3 className="mt-2 text-[1.12rem] font-medium tracking-tight">{b.title}</h3>
                <p className="mt-1.5 text-ink-2">{b.body}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="lg-sm rounded-full px-3 py-1 text-[0.82rem] font-medium">{b.impact}</span>
                  <span className="text-[0.9rem] text-accent group-hover:underline">See how →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Work */}
      <section className="pt-24">
        <SectionHead title="Selected work" href="/work" cta="All case studies" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {work.slice(0, 6).map((w) => (
            <WorkCard key={w.slug} work={w} />
          ))}
        </div>
      </section>

      {/* Writing + now */}
      <section className="grid gap-12 pt-24 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <SectionHead title="Writing" href="/blog" cta="All posts" />
          <div className="mt-6 divide-y divide-line border-y border-line">
            {posts.length ? posts.map((p) => <PostRow key={p.slug} post={p} />) : <p className="py-6 text-ink-2">First posts are on the way.</p>}
          </div>
        </div>
        <div>
          <SectionHead title="Now" href="/now" cta="More" />
          <ul className="mt-6 space-y-4 border-l border-line pl-5">
            {now.highlights.map((h) => (
              <li key={h} className="text-[1.02rem] leading-snug text-ink-2">{h}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
