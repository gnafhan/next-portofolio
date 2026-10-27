import { getAllPosts, getPost } from "@/lib/content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, { params }: RouteContext<"/blog/[slug]/raw.md">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return new Response("Not found", { status: 404 });
  const text = `# ${post.title}\n\n> ${post.description}\n\n${post.body.trim()}\n`;
  return new Response(text, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
