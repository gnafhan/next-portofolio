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

  // Keyboard shortcuts: W, B, N, A for sections, H for home, T for theme.
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
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3">
        <Link href="/" aria-label="Home" className="glass flex size-12 items-center justify-center rounded-full">
          <Logo size={26} />
        </Link>
        <nav aria-label="Main" className="justify-self-center">
          <ul className="glass flex items-center gap-0.5 rounded-full p-1">
            {nav.map((n) => {
              const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    title={`${n.label} (${n.key})`}
                    className={`block rounded-full px-3 py-1.5 text-[0.88rem] transition-colors sm:px-4 ${
                      active ? "bg-ink/[0.07] text-ink dark:bg-white/[0.12]" : "text-ink-2 hover:text-ink"
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
    </header>
  );
}
