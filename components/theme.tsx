"use client";

import { ThemeProvider as NextThemes, useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex size-9 items-center justify-center rounded-full border border-line text-ink-2 hover:bg-surface-2 hover:text-ink"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title="Theme (T)"
    >
      {mounted ? dark ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} /> : <span className="size-4" />}
    </button>
  );
}
