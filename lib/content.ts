import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const CONTENT_DIR = path.join(process.cwd(), "content");
// Cache parsed content only in production builds; in dev, edits to MDX show up on refresh.
const useCache = process.env.NODE_ENV === "production";

// Drafts show up in `next dev` and on Vercel preview deployments, never in production.
const showDrafts = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV !== "production"
  : process.env.NODE_ENV !== "production";

export type Heading = { depth: 2 | 3; text: string; id: string };

type Base = {
  slug: string;
  title: string;
  body: string;
  headings: Heading[];
  readingMinutes: number;
  icon: string;
};

export type Post = Base & {
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  draft: boolean;
  cover?: string;
  /** name of an illustrated scene (see components/work-thumb.tsx) */
  scene?: string;
};

export type WorkLink = { label: string; href: string };

export type Work = Base & {
  summary: string;
  role: string;
  period: string;
  stack: string[];
  order: number;
  featured: boolean;
  links: WorkLink[];
};

function readDir(kind: "blog" | "work") {
  const dir = path.join(CONTENT_DIR, kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.mdx?$/, ""), data, body: content };
    });
}

function extractHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[`*_]/g, "").replace(/\[(.+?)\]\(.+?\)/g, "$1");
    headings.push({ depth: m[1].length as 2 | 3, text, id: slugger.slug(text) });
  }
  return headings;
}

function readingMinutes(body: string) {
  const words = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "");
}

let postsCache: Post[] | null = null;
export function getAllPosts(): Post[] {
  if (!postsCache || !useCache) {
    postsCache = readDir("blog")
      .map(({ slug, data, body }) => ({
        slug,
        body,
        title: String(data.title),
        description: String(data.description ?? ""),
        date: toDateString(data.date),
        updated: data.updated ? toDateString(data.updated) : undefined,
        tags: (data.tags as string[]) ?? [],
        draft: Boolean(data.draft),
        icon: String(data.icon ?? "spark"),
        cover: data.cover ? String(data.cover) : undefined,
        scene: data.scene ? String(data.scene) : undefined,
        headings: extractHeadings(body),
        readingMinutes: readingMinutes(body),
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }
  return postsCache.filter((p) => showDrafts || !p.draft);
}

export function getPost(slug: string) {
  return getAllPosts().find((p) => p.slug === slug);
}

let workCache: Work[] | null = null;
export function getAllWork(): Work[] {
  if (!workCache || !useCache) {
    workCache = readDir("work")
      .map(({ slug, data, body }) => ({
        slug,
        body,
        title: String(data.title),
        summary: String(data.summary ?? ""),
        role: String(data.role ?? ""),
        period: String(data.period ?? ""),
        stack: (data.stack as string[]) ?? [],
        order: Number(data.order ?? 99),
        featured: Boolean(data.featured),
        links: (data.links as WorkLink[]) ?? [],
        icon: String(data.icon ?? "flow"),
        headings: extractHeadings(body),
        readingMinutes: readingMinutes(body),
      }))
      .sort((a, b) => a.order - b.order);
  }
  return workCache;
}

export function getWork(slug: string) {
  return getAllWork().find((w) => w.slug === slug);
}

export function getPage(name: string) {
  const file = path.join(CONTENT_DIR, `${name}.mdx`);
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { data, body: content };
}

export function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
