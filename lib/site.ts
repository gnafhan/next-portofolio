export const site = {
  name: "Ghifari Nafhan",
  shortName: "Nafhan",
  url: "https://nafhan.com",
  title: "Ghifari Nafhan · AI engineer, full-stack",
  headline: "Software engineer building AI systems that actually get used.",
  description:
    "I ship AI systems into messy, real-world workflows, full-stack from data to UI. Case studies, build logs and production AI lessons.",
  location: "Yogyakarta, Indonesia",
  email: "nafhanghifari@gmail.com",
  links: {
    github: "https://github.com/gnafhan",
    linkedin: "https://www.linkedin.com/in/gnafhan",
  },
} as const;

export const nav = [
  { key: "W", label: "Work", href: "/work" },
  { key: "B", label: "Blog", href: "/blog" },
  { key: "N", label: "Now", href: "/now" },
  { key: "A", label: "About", href: "/about" },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
