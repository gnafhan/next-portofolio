import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { Figure } from "@/components/mdx/figure";
import { Flow } from "@/components/mdx/flow";
import { Mermaid } from "@/components/mdx/mermaid";
import { Callout } from "@/components/mdx/callout";
import { Stats } from "@/components/mdx/stats";
import { Pre } from "@/components/mdx/pre";
import { BarChart } from "@/components/mdx/bar-chart";
import { Video, YouTube, Img } from "@/components/mdx/media";
import { Glyph } from "@/components/icons";

function Heading({ as: Tag, id, children }: { as: "h2" | "h3"; id?: string; children: React.ReactNode }) {
  return (
    <Tag id={id}>
      {children}
      {id && (
        <a href={`#${id}`} className="anchor" aria-label="Link to this section">
          #
        </a>
      )}
    </Tag>
  );
}

export const mdxComponents = {
  Figure,
  Flow,
  Mermaid,
  Callout,
  Stats,
  BarChart,
  Video,
  YouTube,
  Glyph,
  pre: Pre,
  img: Img,
  h2: (p: React.ComponentProps<"h2">) => <Heading as="h2" id={p.id}>{p.children}</Heading>,
  h3: (p: React.ComponentProps<"h3">) => <Heading as="h3" id={p.id}>{p.children}</Heading>,
  a: ({ href = "", ...p }: React.ComponentProps<"a">) =>
    href.startsWith("http") ? <a href={href} target="_blank" rel="noopener" {...p} /> : <a href={href} {...p} />,
};

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        // Content lives in this repo and is reviewed before merge, so JS expressions
        // in props (items={[...]}) are allowed.
        blockJS: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark" }, keepBackground: false }],
          ],
        },
      }}
    />
  );
}
