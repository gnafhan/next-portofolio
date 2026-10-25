"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { nav } from "@/lib/site";
import { Logo } from "./icons";
import { ThemeToggle } from "./theme";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  // Keyboard shortcuts with Alt/Option held (WCAG 2.1.4): W, B, N, A for sections, H for home, T for theme.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.metaKey || e.ctrlKey || e.repeat) return;
      const t = e.target as HTMLElement;
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const key = e.code.replace("Key", "");
      if (key === "H") return router.push("/");
      if (key === "T") return setTheme(resolvedTheme === "dark" ? "light" : "dark");
      const item = nav.find((n) => n.key === key);
      if (item) router.push(item.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, resolvedTheme, setTheme]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Home" className="flex items-center gap-2.5">
          <Logo size={26} />
          <span className="hidden text-[0.98rem] font-semibold tracking-tight sm:inline">Ghifari Nafhan</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Main">
            <ul className="flex items-center">
              {nav.map((n) => {
                const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      aria-current={active ? "page" : undefined}
                      title={`${n.label} (Alt+${n.key})`}
                      className={`block rounded-full px-3 py-1.5 text-[0.92rem] transition-colors ${
                        active ? "text-ink" : "text-ink-3 hover:text-ink"
                      }`}
                    >
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
