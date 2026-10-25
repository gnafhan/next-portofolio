import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WorkThumb } from "./work-thumb";
import { TechChip } from "./tech-chip";
import { formatDate, type Post, type Work } from "@/lib/content";

export function WorkCard({ work, large = false }: { work: Work; large?: boolean }) {
  return (
    <Link href={`/work/${work.slug}`} className="glass glass-hover group flex h-full flex-col rounded-2xl p-6">
      <div className="relative -mx-2 -mt-2">
        <WorkThumb slug={work.slug} />
        <div className="absolute right-2 top-2">
          <span className="lg flex size-8 items-center justify-center rounded-full text-ink-3 group-hover:text-ink">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
      <div className="mt-4 text-[0.78rem] text-ink-3">{work.period} · {work.role}</div>
      <h3 className={`mt-1 font-semibold tracking-tight ${large ? "text-[1.4rem]" : "text-[1.15rem]"}`}>{work.title}</h3>
      <p className="mt-2 text-[0.93rem] leading-relaxed text-ink-2">{work.summary}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {work.stack.slice(0, 4).map((s) => (
          <TechChip key={s} name={s} />
        ))}
      </div>
    </Link>
  );
}

export function PostRow({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-2xl px-2 py-4 transition hover:bg-surface-2 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
      <span className="glass relative block h-[68px] w-[112px] overflow-hidden rounded-xl">
        <span className="absolute left-0 top-0 block w-[280px] origin-top-left scale-[0.4]">
          <WorkThumb slug={post.scene ?? ""} />
        </span>
      </span>
      <div>
        <div className="font-medium leading-snug group-hover:text-accent">
          {post.title}
          {post.draft && <span className="ml-2 rounded-full bg-[var(--human)]/15 px-2 py-0.5 align-middle text-[0.72rem] font-medium text-[var(--human)]">draft</span>}
        </div>
        <div className="mt-1 line-clamp-2 text-[0.9rem] text-ink-2">{post.description}</div>
      </div>
      <time dateTime={post.date} className="col-start-2 text-[0.8rem] text-ink-3 sm:col-start-3 sm:pt-0.5">
        {formatDate(post.date)}
      </time>
    </Link>
  );
}
