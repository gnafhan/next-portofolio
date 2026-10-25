import type { MetadataRoute } from "next";
import { getAllPosts, getAllWork, getPage } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

// Google ignores changefreq/priority and only trusts lastmod when it is accurate,
// so lastModified is set only where we know the real date.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().filter((p) => !p.draft);
  const nowUpdated = getPage("now").data.updated;
  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/work") },
    ...(posts.length ? [{ url: absoluteUrl("/blog"), lastModified: posts[0].updated ?? posts[0].date }] : []),
    { url: absoluteUrl("/now"), lastModified: nowUpdated instanceof Date ? nowUpdated : String(nowUpdated) },
    { url: absoluteUrl("/about") },
    ...getAllWork().map((w) => ({ url: absoluteUrl(`/work/${w.slug}`) })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updated ?? p.date })),
  ];
}
