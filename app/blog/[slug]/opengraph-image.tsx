import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { getAllPosts, getPost } from "@/lib/content";

export const alt = "Blog post";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return renderOg({ kicker: "Blog", title: post?.title ?? "Blog", description: post?.description, icon: post?.icon });
}
