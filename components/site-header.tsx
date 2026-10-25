"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { nav } from "@/lib/site";
import { PixelIcon } from "./pixel-icon";
import { ThemeToggle } from "./theme";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement;
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const key = e.key.toUpperCase();
      if (key === "H") return router.push("/");
      if (key === "T") return setTheme(resolvedTheme === "dark" ? "light" : "dark");
      const item = nav.find((n) => n.key === key);
      if (item) router.push(item.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, resolvedTheme, setTheme]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-accent" aria-label="Home">
          <PixelIcon name="logo" size={22} />
          <span className="font-mono text-[0.8rem] font-medium tracking-wide text-ink">nafhan</span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6" aria-label="Main">
          {nav.map((n) => {
            const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`font-mono text-[0.72rem] uppercase tracking-wider transition-colors ${
                  active ? "text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                <span className="hidden sm:inline">[{n.key}] </span>
                {n.label}
              </Link>
            );
          })}
          <span className="hidden sm:block">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
