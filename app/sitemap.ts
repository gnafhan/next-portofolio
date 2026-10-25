import type { MetadataRoute } from "next";
import { getAllPosts, getAllWork, getPage } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().filter((p) => !p.draft);
  const latest = posts[0]?.updated ?? posts[0]?.date;
  const nowUpdated = getPage("now").data.updated;
  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/work"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/blog"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/now"), lastModified: nowUpdated instanceof Date ? nowUpdated : String(nowUpdated), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.7 },
    ...getAllWork().map((w) => ({ url: absoluteUrl(`/work/${w.slug}`), changeFrequency: "yearly" as const, priority: 0.8 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updated ?? p.date, changeFrequency: "yearly" as const, priority: 0.8 })),
  ];
}
