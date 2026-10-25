import type { Metadata } from "next";
import { getPage, formatDate } from "@/lib/content";
import { Mdx } from "@/lib/mdx";
import { PageIntro } from "@/components/page-intro";
import { NowScenes } from "@/components/illustrations";

export const metadata: Metadata = {
  title: "Now",
  description: "What Ghifari Nafhan is focused on right now.",
  alternates: { canonical: "/now" },
};

export default function NowPage() {
  const { data, body } = getPage("now");
  const updated = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated);
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageIntro icon="spark" label={`Updated ${formatDate(updated)}`} title="Now">
        What I&apos;m focused on at the moment.
      </PageIntro>
      <NowScenes />
      <article className="article prose mt-12 max-w-[44rem]">
        <Mdx source={body} />
      </article>
    </div>
  );
}
