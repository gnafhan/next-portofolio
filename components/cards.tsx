import Link from "next/link";
import { IconTile } from "./pixel-icon";
import { formatDate, type Post, type Work } from "@/lib/content";
import { toneFor } from "@/lib/tone";

export function WorkCard({ work, large = false }: { work: Work; large?: boolean }) {
  return (
    <Link
      href={`/work/${work.slug}`}
      className="group flex h-full flex-col rounded-[14px] border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-line-strong"
    >
      <div className="flex items-start justify-between gap-3">
        <IconTile name={work.icon} tone={toneFor(work.order)} size={large ? 52 : 44} />
        <span className="label">{work.period}</span>
      </div>
      <h3 className={`mt-5 font-semibold tracking-tight ${large ? "text-[1.35rem]" : "text-[1.1rem]"}`}>{work.title}</h3>
      <p className="mt-2 text-[0.93rem] leading-relaxed text-ink-2">{work.summary}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {work.stack.slice(0, 4).map((s) => (
          <span key={s} className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[0.7rem] text-ink-2">{s}</span>
        ))}
      </div>
    </Link>
  );
}

export function PostRow({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid grid-cols-[auto_minmax(0,1fr)] gap-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
      <IconTile name={post.icon} size={40} />
      <div>
        <div className="font-medium leading-snug group-hover:text-accent">
          {post.title}
          {post.draft && <span className="ml-2 align-middle font-mono text-[0.65rem] uppercase text-[var(--human)]">draft</span>}
        </div>
        <div className="mt-1 line-clamp-2 text-[0.9rem] text-ink-2">{post.description}</div>
      </div>
      <time dateTime={post.date} className="col-start-2 font-mono text-[0.72rem] uppercase tracking-wider text-ink-3 sm:col-start-3 sm:pt-1">
        {formatDate(post.date)}
      </time>
    </Link>
  );
}
