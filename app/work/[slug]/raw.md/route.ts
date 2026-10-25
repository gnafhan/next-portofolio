import { getAllWork, getWork } from "@/lib/content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllWork().map((w) => ({ slug: w.slug }));
}

export async function GET(_req: Request, { params }: RouteContext<"/work/[slug]/raw.md">) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return new Response("Not found", { status: 404 });
  const text = `# ${work.title}\n\n> ${work.summary}\n\n${work.body.trim()}\n`;
  return new Response(text, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
