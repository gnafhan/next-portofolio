import type { Metadata } from "next";

export const site = {
  name: "Ghifari Nafhan",
  shortName: "Nafhan",
  url: "https://nafhan.com",
  title: "Ghifari Nafhan · AI engineer, full-stack",
  headline: "I build AI that turns hours of manual work into minutes.",
  description:
    "Software engineer automating slow, manual work with AI, end to end from data to UI. Case studies, build logs and production AI lessons.",
  location: "Yogyakarta, Indonesia",
  email: "nafhanghifari@gmail.com",
  // self-hosted Plausible on vps-nafhan (dashboard: plausible.catataja.id, site "nafhan.com")
  analytics: { domain: "nafhan.com", script: "https://analytics.nafhan.com/js/script.js" },
  links: {
    github: "https://github.com/gnafhan",
    linkedin: "https://www.linkedin.com/in/gnafhan",
  },
} as const;

export const nav = [
  { key: "W", label: "Work", href: "/work" },
  { key: "B", label: "Blog", href: "/blog" },
  { key: "C", label: "Certificates", href: "/certificates" },
  { key: "A", label: "About", href: "/about" },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

/** Per-page metadata with matching Open Graph and Twitter tags (pages must not inherit the home page's). */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} · ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, siteName: site.name, locale: "en_US", title: full, description },
    twitter: { card: "summary_large_image", title: full, description },
  };
}
