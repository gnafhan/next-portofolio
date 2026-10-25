# nafhan.com

Personal site of Ghifari Nafhan. Next.js 16 (App Router) + TypeScript + Tailwind v4 + MDX.
Every page is static HTML generated at build time. Deployed on Vercel from `main`.

```bash
npm install
npm run dev     # http://localhost:3000, drafts visible
npm run build   # production build, drafts hidden
```

## Content

```
content/
  blog/<slug>.mdx    blog posts       → /blog/<slug>
  work/<slug>.mdx    case studies     → /work/<slug>
  now.mdx            the /now page
lib/profile.ts       experience, awards, certifications (About page)
lib/site.ts          name, headline, links
```

The file name is the URL slug: lowercase, words joined with `-`.

### Add a blog post

1. Create `content/blog/<slug>.mdx`:

   ```mdx
   ---
   title: "From 3 Hours to 3 Minutes: I Built an AI Agent to Grade Lab Reports"
   description: "One or two sentences. Used for SEO, the card, RSS and the OG image."
   date: 2026-11-03          # YYYY-MM-DD, publish date
   updated: 2026-11-10       # optional
   tags: [ai-engineering, evals]
   icon: check               # wallet inbox pulse plate check home chat chart flow spark
   draft: true               # optional; true = only visible in dev and Vercel previews
   ---

   Body in Markdown/MDX. Use ## and ### headings; they build the table of contents.
   ```

2. Commit. A pull request gets a Vercel preview where drafts are visible.
   Merging to `main` deploys to nafhan.com. Remove `draft: true` (or set it to `false`) to publish.

Drafts are excluded from production pages, the sitemap, RSS and `llms.txt`, and are `noindex` on previews.

MDX notes: HTML comments (`<!-- -->`) are not allowed, use `{/* comment */}`. A literal `{` or `<`
in prose must be escaped (`\{`, `&lt;`) or put in backticks.

### Illustrations (MDX components, no import needed)

Every post should carry at least one illustration. Wrap it in `<Figure>` to get a title, a
"Fig A" caption and copy/download-as-PNG buttons.

```mdx
<Figure title="One message, end to end" sub="Short subtitle" caption="One-sentence takeaway.">
  <Flow items={[
    { section: "Inbound", label: "Chat message", note: "text, photo or voice", kind: "auto" },
    { label: "Review", note: "a person approves", kind: "human" },
  ]} />
</Figure>

<Figure title="Architecture">
  <Mermaid chart={`flowchart TB
    A[Input] --> B{Router}
    B --> C[Tools]`} />
</Figure>

<Figure title="Cost per run"><BarChart unit="s" items={[{ label: "Before", value: 180 }, { label: "After", value: 3, highlight: true }]} /></Figure>

<Callout type="lesson">note | lesson | warn</Callout>
<Stats items={[{ value: "3h → 3m", label: "weekly review time" }]} />
<Video src="/media/demo.mp4" caption="..." />
<YouTube id="VIDEO_ID" />
![alt text](/media/diagram.png)
```

- `Flow` kinds: `auto` (automated), `human` (a person decides), `check` (plain step).
- Prefer `flowchart TB` in Mermaid; wide `LR` charts scroll horizontally.
- Images and videos go in `public/media/` (referenced as `/media/...`).
- Code blocks get syntax highlighting and a copy button: ```` ```ts title="file.ts" ````.

### Add a case study

Same as a post, in `content/work/<slug>.mdx`, with this frontmatter:

```yaml
title: "CatatAja"
summary: "One sentence, <= 160 chars."
role: "Founder & lead engineer"
period: "2026"
stack: ["Python", "FastAPI"]
icon: "wallet"
order: 1          # position on /work
featured: true    # shown on the home page (first 3)
links: []         # [{ label: "Live site", href: "https://..." }]
```

All content must pass the NDA rules in the self-manage repo (`branding/NDA.md`) before merge.

## SEO and feeds

- Per-page `<title>`, description, canonical URL, Open Graph/Twitter tags and generated OG images.
- JSON-LD: `Person` + `WebSite` on every page, `BlogPosting` on posts.
- `/sitemap.xml`, `/robots.txt` (previews are `Disallow: /`), `/rss.xml`, `/llms.txt`.
- Each post and case study is also served as Markdown at `<url>/raw.md`.
- Google Search Console: set `GOOGLE_SITE_VERIFICATION` in Vercel to emit the verification meta tag,
  then submit `https://nafhan.com/sitemap.xml`.
