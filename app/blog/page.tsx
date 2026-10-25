import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import { PostRow } from "@/components/cards";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Blog",
  description: "Production AI lessons and build logs: evals, grounding, failure modes, and the full-stack plumbing around LLM features.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const tags = [...new Set(posts.flatMap((p) => p.tags))].slice(0, 12);
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageIntro icon="chat" label="[B] Blog" title="Writing">
        Production AI lessons and build logs. What worked, what didn&apos;t, and why. Subscribe via{" "}
        <Link href="/rss.xml" className="text-accent underline underline-offset-4">RSS</Link>.
      </PageIntro>
      {tags.length > 0 && (
        <ul className="mb-6 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-3 py-1 text-[0.8rem] text-ink-2">{t}</li>
          ))}
        </ul>
      )}
      <div className="max-w-4xl divide-y divide-line border-y border-line">
        {posts.length ? posts.map((p) => <PostRow key={p.slug} post={p} />) : <p className="py-8 text-ink-2">First posts are on the way.</p>}
      </div>
    </div>
  );
}
