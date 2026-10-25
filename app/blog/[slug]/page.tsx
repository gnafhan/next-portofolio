import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { JsonLd } from "@/components/json-ld";
import { Mdx } from "@/lib/mdx";
import { formatDate, getAllPosts, getPost } from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [site.url],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const url = absoluteUrl(`/blog/${post.slug}`);
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === post.slug);
  const newer = posts[idx - 1];
  const older = posts[idx + 1];

  return (
    <>
      <ArticleLayout
        icon={post.icon}
        kicker={
          <Link href="/blog" className="label hover:text-ink">
            ← Blog{post.draft ? " · draft (not public)" : ""}
          </Link>
        }
        title={post.title}
        description={post.description}
        meta={[
          { label: "Author", value: <Link href="/about" className="hover:underline">{site.name}</Link> },
          { label: "Topic", value: post.tags.slice(0, 2).join(", ") || "Engineering" },
          { label: "Published", value: <time dateTime={post.date}>{formatDate(post.date)}</time> },
        ]}
        headings={post.headings}
        minutes={post.readingMinutes}
        url={url}
        markdownUrl={`/blog/${post.slug}/raw.md`}
        footer={
          (newer || older) && (
            <nav className="mt-12 grid gap-3 sm:grid-cols-2" aria-label="More posts">
              {older ? (
                <Link href={`/blog/${older.slug}`} className="rounded-[10px] border border-line bg-surface p-4 hover:border-line-strong">
                  <div className="label">Previous</div>
                  <div className="mt-1 font-medium">{older.title}</div>
                </Link>
              ) : <span />}
              {newer && (
                <Link href={`/blog/${newer.slug}`} className="rounded-[10px] border border-line bg-surface p-4 text-right hover:border-line-strong">
                  <div className="label">Next</div>
                  <div className="mt-1 font-medium">{newer.title}</div>
                </Link>
              )}
            </nav>
          )
        }
      >
        <Mdx source={post.body} />
      </ArticleLayout>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          url,
          mainEntityOfPage: url,
          image: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
          keywords: post.tags.join(", "),
          author: { "@id": absoluteUrl("/#person") },
          publisher: { "@id": absoluteUrl("/#person") },
          inLanguage: "en",
        }}
      />
    </>
  );
}
