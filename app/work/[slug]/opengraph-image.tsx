import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { getAllWork, getWork } from "@/lib/content";

export const alt = "Case study";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllWork().map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  return renderOg({ kicker: "Case study", title: work?.title ?? "Work", description: work?.summary, icon: work?.icon });
}
