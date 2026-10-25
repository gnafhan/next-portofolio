import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ kicker: "AI engineer · full-stack", title: "I build AI that turns hours of manual work into minutes.", description: site.description });
}
