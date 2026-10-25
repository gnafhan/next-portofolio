import { getAllWork } from "@/lib/content";
import { WorkCard } from "@/components/cards";
import { PageIntro } from "@/components/page-intro";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Work: case studies",
  description: "Case studies of AI and full-stack systems I built: what the problem was, what I shipped, and the decisions that mattered.",
  path: "/work",
});

export default function WorkIndex() {
  const work = getAllWork();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageIntro icon="flow" label="Work" title="Case studies">
        Things I built end to end, mostly AI features that had to survive real users and real data. Each one covers the
        problem, what I shipped, and the decisions I&apos;d make again.
      </PageIntro>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {work.map((w) => <WorkCard key={w.slug} work={w} as="h2" />)}
      </div>
      <p className="mt-10 max-w-2xl text-[0.9rem] text-ink-3">
        Most of my professional work is under NDA, so it doesn&apos;t appear here. These are my own projects, where I can show
        the whole thing.
      </p>
    </div>
  );
}
