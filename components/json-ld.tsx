import { site, absoluteUrl } from "@/lib/site";

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped is safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: site.name,
    alternateName: "Nafhan",
    url: site.url,
    jobTitle: "Software Engineer (AI and full-stack)",
    description: site.headline,
    address: { "@type": "PostalAddress", addressLocality: "Yogyakarta", addressCountry: "ID" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Universitas Gadjah Mada" },
    knowsAbout: ["AI engineering", "Large language models", "Retrieval-augmented generation", "Full-stack development", "Data pipelines"],
    image: absoluteUrl("/images/nafhan.png"),
    sameAs: [site.links.github, site.links.linkedin],
  };
}

export function breadcrumbSchema(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: absoluteUrl(it.path) } : {}),
    })),
  };
}

/** Dates in structured data carry the site's timezone (WIB). */
export function isoDate(date: string) {
  return `${date}T00:00:00+07:00`;
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: site.url,
    name: site.name,
    publisher: { "@id": absoluteUrl("/#person") },
    inLanguage: "en",
  };
}
