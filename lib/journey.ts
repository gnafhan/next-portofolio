import { experience, honors } from "./profile";
import { certificates } from "./certificates";
import { getAllWork } from "./content";

export type JourneyKind = "study" | "work" | "project" | "award" | "cert";
export type JourneyItem = { year: number; kind: JourneyKind; title: string; sub: string; period: string; href?: string };

const KIND_ORDER: JourneyKind[] = ["study", "work", "project", "award", "cert"];
const startYear = (period: string) => Number(period.match(/\d{4}/)?.[0] ?? 0);

/**
 * Everything on the home timeline, oldest first. Work entries stay as minimal as the About page
 * (organisation, role, years); see branding/NDA.md.
 */
export function getJourney(): JourneyItem[] {
  const work = getAllWork().filter((w) => w.period);
  // a case study about a place already on the timeline (e.g. NutriPlate) links that entry instead
  const caseFor = (org: string) => work.find((w) => w.title === org);
  const items: JourneyItem[] = [
    { year: 2023, kind: "study", title: "Universitas Gadjah Mada", sub: "Applied bachelor's in Software Engineering", period: "2023 – 2027" },
    { year: 2023, kind: "work", title: "Freelance web & full-stack", sub: "Client websites and a full-stack internship", period: "2023 – 2024" },
    ...experience.map((e) => {
      const cs = caseFor(e.org);
      return { year: startYear(e.period), kind: "work" as const, title: e.org, sub: e.role, period: e.period, href: cs && `/work/${cs.slug}` };
    }),
    ...honors.map((h) => ({ year: Number(h.year), kind: "award" as const, title: h.title, sub: "Award", period: h.year })),
    ...work
      .filter((w) => !experience.some((e) => e.org === w.title))
      .map((w) => ({ year: startYear(w.period), kind: "project" as const, title: w.title, sub: w.role || "Project", period: w.period, href: `/work/${w.slug}` })),
    ...certificates
      .filter((c) => c.featured && c.date)
      .map((c) => ({ year: startYear(c.date!), kind: "cert" as const, title: c.title, sub: `${c.issuer} certificate`, period: c.date!.slice(0, 4), href: "/certificates" })),
  ];
  return items
    .filter((i) => i.year)
    .sort((a, b) => a.year - b.year || KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
}
