import { getAllPosts, getAllWork } from "@/lib/content";
import { certificates, ISSUER_ORDER } from "@/lib/certificates";
import { earlier, experience, focus, honors } from "@/lib/profile";
import { getJourney } from "@/lib/journey";
import { absoluteUrl, site } from "@/lib/site";

export const dynamic = "force-static";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** MDX body to plain prose: drop imports, JSX components and code, keep the words. */
function plain(mdx: string, max = 1600) {
  const text = mdx
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^import .*$/gm, " ")
    .replace(/<[A-Z][\s\S]*?(\/>|<\/[A-Z][A-Za-z]*>)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).replace(/\s\S*$/, "")}…` : text;
}

/**
 * Everything Nafi (the site's AI guide) may know and point at: public site content only, plus the
 * data-agent anchors it can scroll to and spotlight. Consumed by the agent service on vps-nafhan.
 */
export function GET() {
  const work = getAllWork();
  const posts = getAllPosts().filter((p) => !p.draft);
  const years = [...new Set(getJourney().map((j) => j.year))];
  const anchors = [
    { id: "hero", page: "/", label: "Home hero: who Nafhan is, headline, buttons to work and LinkedIn" },
    { id: "what-i-build", page: "/", label: "What I build: four problems solved end to end, each with an animated demo" },
    { id: "journey", page: "/", label: "Journey timeline from 2023 to now (study, roles, projects, awards)" },
    ...years.map((y) => ({ id: `journey-year-${y}`, page: "/", label: `Journey: jump to ${y} (desktop only)` })),
    { id: "work", page: "/", label: "Selected work: project cards" },
    ...work.map((w) => ({ id: `work-${w.slug}`, page: "/", label: `Project card: ${w.title}` })),
    { id: "certificates-preview", page: "/", label: "Small certificate pile on the home page" },
    { id: "contact", page: "*", label: "Footer with email, LinkedIn, GitHub (on every page)" },
    { id: "cert-pile", page: "/certificates", label: "Certificate pile that fans out on scroll" },
    { id: "cert-stats", page: "/certificates", label: "Counts: certificates, issuers, verifiable" },
    ...ISSUER_ORDER.map((i) => ({ id: `issuer-${slug(i)}`, page: "/certificates", label: `Certificates from ${i}` })),
    ...certificates.map((c) => ({ id: `cert-${slug(c.title)}`, page: "/certificates", label: `Certificate: ${c.title} (${c.issuer})` })),
    ...["short-version", "links", "experience", "awards-credentials", "this-site"].map((s) => ({
      id: `about-${s}`,
      page: "/about",
      label: `About page section: ${s.replace(/-/g, " ")}`,
    })),
  ];

  const data = {
    site: site.url,
    person: {
      name: site.name,
      headline: site.headline,
      description: site.description,
      location: site.location,
      email: site.email,
      links: site.links,
      focus,
      about:
        "Most of his work sits between backend systems, data and turning an idea into something people use every day. Lately that means LLM features: assistants grounded in real data, agents that call tools instead of guessing, evals that catch regressions, and the pipelines and UI around them. He has shipped across healthtech, education, finance and internal tools. He cares about deterministic code for anything touching money or records, and a human approval step where mistakes are expensive. He is finishing an applied bachelor's in Software Engineering Technology at Universitas Gadjah Mada, where he was a practicum assistant and coordinator for two years.",
    },
    experience,
    earlier,
    honors,
    journey: getJourney().map(({ year, kind, title, sub, period }) => ({ year, kind, title, sub, period })),
    certificates: certificates.map((c) => ({ title: c.title, issuer: c.issuer, date: c.date ?? null, verifiable: !!c.url, anchor: `cert-${slug(c.title)}` })),
    work: work.map((w) => ({
      slug: w.slug,
      title: w.title,
      url: `/work/${w.slug}`,
      role: w.role,
      period: w.period,
      stack: w.stack,
      summary: w.summary,
      text: plain(w.body),
    })),
    posts: posts.map((p) => ({ slug: p.slug, title: p.title, url: `/blog/${p.slug}`, date: p.date, description: p.description })),
    pages: [
      { path: "/", title: "Home" },
      { path: "/work", title: "All case studies" },
      ...work.map((w) => ({ path: `/work/${w.slug}`, title: `Case study: ${w.title}` })),
      { path: "/blog", title: "Blog" },
      ...posts.map((p) => ({ path: `/blog/${p.slug}`, title: `Post: ${p.title}` })),
      { path: "/certificates", title: "Certificates" },
      { path: "/about", title: "About" },
    ],
    anchors,
    feeds: { llms: absoluteUrl("/llms.txt"), rss: absoluteUrl("/rss.xml") },
  };
  return Response.json(data, { headers: { "Cache-Control": "public, max-age=600" } });
}
