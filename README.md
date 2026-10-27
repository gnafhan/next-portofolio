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
   scene: lab-report-grading-agent  # optional animated header scene, see components/work-thumb.tsx
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

Every post needs at least one real illustration, not a boring box diagram. Prefer, in order:

1. **`<Layers>`**: isometric stacked layers with holes; things fall through and stop at the layer that catches them.
   Use it for safeguards, checks, filters, defence in depth.
   ```mdx
   <Figure title="Three layers, not one rule" sub="What each decision stops" caption="...">
     <Layers
       top="what comes in"
       bottom="reaches production"
       layers={[{ label: "whitelist" }, { label: "write tools denied" }, { label: "human approval" }]}
       items={[{ at: 0.12, label: "unlisted chat", blockedBy: 0 }, { at: 0.56, label: "real request" }]}
     />
   </Figure>
   ```
   `at` is the horizontal position (0 to 1). Items without `blockedBy` pass every layer and reach `bottom`.
2. **`<Converge>`**: many sources flow (animated dots) into one hub, then into outputs, with an optional `gate`
   line (e.g. "I approve"). Use it for "many → one" stories: inboxes, data sources, integrations.
   ```mdx
   <Converge sources={["Work chats", "Email"]} hub="AI assistant" hubNote="read-only" gate="I approve" outputs={["Tickets", "Standup draft"]} />
   ```
3. **`<Pipeline>`**: isometric blocks in a row; a token travels across and its text changes at each stage,
   so readers see what every step does to the data. Mark a person's step with `human: true`.
   ```mdx
   <Pipeline stages={[
     { label: "WhatsApp", note: "the user types", token: "coffee & bread 40k" },
     { label: "Model", note: "reads the intent", token: "2 expenses" },
     { label: "Me", note: "final call", token: "approved ✓", human: true },
   ]} />
   ```
4. **`<Flow>`** for step-by-step timelines, **`<BarChart>`** / **`<Stats>`** for numbers.
5. **`<Mermaid>`** only as a last resort, for graphs the components above can't express.


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

### Add a certificate

Add an entry to `lib/certificates.ts`: `title`, `issuer`, and when you have them `date` ("YYYY-MM"),
`image` (a direct image URL on i.imgur.com or api2.sololearn.com, or add another host to
`images.remotePatterns` in `next.config.ts`), `url` (verify link) and `id`. `featured: true` puts it
at the top of the pile and on the home timeline. A new issuer also needs a spot in `ISSUER_ORDER`.
Entries without an image render as a typeset card.

## SEO and feeds

- Per-page `<title>`, description, canonical URL, Open Graph/Twitter tags and generated OG images.
- JSON-LD: `Person` + `WebSite` on every page, `BlogPosting` on posts.
- `/sitemap.xml`, `/robots.txt` (previews are `Disallow: /`), `/rss.xml`, `/llms.txt`.
- Each post and case study is also served as Markdown at `<url>/raw.md`.
- Google Search Console: set `GOOGLE_SITE_VERIFICATION` in Vercel to emit the verification meta tag,
  then submit `https://nafhan.com/sitemap.xml`.

## Analytics

Self-hosted Plausible on vps-nafhan (`/var/www/plausible`, shared with catataja.id). The script (plain
`script.js`; outbound clicks come from `components/outbound-tracker.tsx`) and event endpoint are served
on `analytics.nafhan.com` (only `/js/*` and `/api/event` are routed there);
the dashboard is at plausible.catataja.id, site `nafhan.com`. The script loads only when
`VERCEL_ENV=production`, so previews and local runs are not counted. Config: `site.analytics` in `lib/site.ts`.
