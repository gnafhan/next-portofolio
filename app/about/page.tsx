import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { site } from "@/lib/site";
import { certifications, earlier, experience, honors } from "@/lib/profile";

export const metadata: Metadata = {
  title: "About",
  description: "Ghifari Nafhan is a software engineer in Yogyakarta building AI systems that actually get used, full-stack from data to UI.",
  alternates: { canonical: "/about" },
};

function Section({ id, label, children }: { id?: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} className="grid gap-4 border-t border-line py-10 md:grid-cols-[13rem_minmax(0,1fr)]">
      <h2 className="label pt-1">{label}</h2>
      <div>{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageIntro icon="logo" label="[A] About" title="Hi, I'm Nafhan.">
        Software engineer in {site.location}. I build AI systems that actually get used, and the full stack around them.
      </PageIntro>

      <Section label="Short version">
        <div className="prose max-w-[44rem]">
          <p>
            Most of my work sits between backend systems, data and the messy job of turning an idea into something people
            use every day. Lately that means LLM features: assistants grounded in real data, agents that call tools instead
            of guessing, evals that catch regressions before users do, and the pipelines and UI around all of it.
          </p>
          <p>
            I&apos;ve shipped across healthtech, education, finance and internal tools, from a solo side project to
            production systems with real users. I care about the boring parts that make AI trustworthy: deterministic code
            for anything that touches money or records, and a human approval step where mistakes are expensive.
          </p>
          <p>
            I&apos;m finishing an applied bachelor&apos;s in Software Engineering Technology at Universitas Gadjah Mada, where
            I also spent two years as a practicum assistant and coordinator.
          </p>
        </div>
      </Section>

      <Section label="Links">
        <ul className="flex flex-wrap gap-3">
          {[
            { label: "LinkedIn (full CV)", href: site.links.linkedin },
            { label: "GitHub", href: site.links.github },
            { label: site.email, href: `mailto:${site.email}` },
          ].map((l) => (
            <li key={l.href}>
              <a href={l.href} className="inline-block rounded-full border border-line-strong px-4 py-2 text-[0.9rem] hover:bg-surface-2" target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Experience">
        <ul className="divide-y divide-line">
          {experience.map((e) => (
            <li key={`${e.org}-${e.role}`} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
              <div>
                <span className="font-medium">{e.org}</span>
                <span className="text-ink-2"> · {e.role}</span>
              </div>
              <span className="text-[0.88rem] text-ink-3 sm:pt-0.5">{e.period}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.9rem] text-ink-3">{earlier}</p>
      </Section>

      <Section id="credentials" label="Awards & credentials">
        <div className="grid gap-8 md:grid-cols-2">
          <ul className="space-y-2.5">
            {honors.map((h) => (
              <li key={h.title} className="flex gap-3 text-[0.95rem]">
                <span className="w-10 shrink-0 text-[0.88rem] text-ink-3">{h.year}</span>
                <span>{h.title}</span>
              </li>
            ))}
          </ul>
          <div>
            <ul className="space-y-2.5">
              {certifications.map((c) => (
                <li key={c.title} className="flex gap-3 text-[0.95rem]">
                  <span className="w-10 shrink-0 text-[0.88rem] text-ink-3">{c.year}</span>
                  <span>{c.title} <span className="text-ink-3">· {c.issuer}</span></span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.9rem] text-ink-3">
              The rest of my course certificates live on <a className="underline underline-offset-4" href={site.links.linkedin} target="_blank" rel="noopener">LinkedIn</a>.
            </p>
          </div>
        </div>
      </Section>

      <Section label="This site">
        <p className="max-w-[44rem] text-ink-2">
          Built with Next.js, TypeScript, Tailwind and MDX. Every page is static HTML. Posts carry their own diagrams, and
          you can copy any figure as a PNG. Read <Link className="underline underline-offset-4" href="/now">what I&apos;m doing now</Link>.
        </p>
      </Section>
    </div>
  );
}
