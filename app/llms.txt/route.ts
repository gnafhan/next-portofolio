import { getAllPosts, getAllWork } from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

export const dynamic = "force-static";

// https://llmstxt.org: a plain index of the site for language models.
export function GET() {
  const posts = getAllPosts().filter((p) => !p.draft);
  const work = getAllWork();
  const text = `# ${site.name}

> ${site.headline} ${site.description}

## Case studies
${work.map((w) => `- [${w.title}](${absoluteUrl(`/work/${w.slug}/raw.md`)}): ${w.summary}`).join("\n")}

${posts.length ? `## Blog\n${posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}/raw.md`)}): ${p.description}`).join("\n")}\n` : ""}
## About
- [About](${absoluteUrl("/about")})
- [Certificates](${absoluteUrl("/certificates")})
- [GitHub](${site.links.github})
- [LinkedIn](${site.links.linkedin})
`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
