import Link from "next/link";

export function Breadcrumb({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.85rem] text-ink-3">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {it.path ? (
              <Link href={it.path} className="hover:text-ink">
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-2">
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
