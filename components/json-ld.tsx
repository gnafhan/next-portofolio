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
    sameAs: [site.links.github, site.links.linkedin],
  };
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
