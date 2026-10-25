"use client";

import * as m from "motion/react-m";
import type { IconType } from "react-icons";
import {
  SiAnthropic,
  SiDocker,
  SiFastapi,
  SiGo,
  SiGooglegemini,
  SiLangchain,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTerraform,
  SiTypescript,
} from "react-icons/si";

// brand: hover colour. Monochrome brands (Next.js, LangChain) fall back to the text colour.
const STACK: { name: string; Icon: IconType; brand: string }[] = [
  { name: "Python", brand: "#3776AB", Icon: SiPython },
  { name: "TypeScript", brand: "#3178C6", Icon: SiTypescript },
  { name: "Next.js", brand: "var(--ink)", Icon: SiNextdotjs },
  { name: "React", brand: "#58C4DC", Icon: SiReact },
  { name: "FastAPI", brand: "#009688", Icon: SiFastapi },
  { name: "Go", brand: "#00ADD8", Icon: SiGo },
  { name: "PostgreSQL", brand: "#4169E1", Icon: SiPostgresql },
  { name: "LangGraph", brand: "var(--ink)", Icon: SiLangchain },
  { name: "Claude", brand: "#D97757", Icon: SiAnthropic },
  { name: "Gemini", brand: "#8E75B2", Icon: SiGooglegemini },
  { name: "Docker", brand: "#2496ED", Icon: SiDocker },
  { name: "Terraform", brand: "#844FBA", Icon: SiTerraform },
];

/** Floating tech-stack icons (the bobbing row from the 2024 site): hover for colour, drag to toss. */
export function TechStack() {
  return (
    <ul className="grid grid-cols-4 place-items-center gap-y-10 sm:grid-cols-6 lg:grid-cols-12" aria-label="Tech I work with">
      {STACK.map(({ name, Icon, brand }, i) => (
        <li key={name} className="group flex flex-col items-center gap-2" title={name}>
          <span style={{ animation: `bob 3.2s ease-in-out ${(i % 4) * -0.8}s infinite` }}>
            <m.span
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragTransition={{ bounceStiffness: 260, bounceDamping: 12 }}
              whileHover={{ scale: 1.15 }}
              whileDrag={{ scale: 1.05 }}
              className="block cursor-grab text-ink-3 transition-colors duration-300 group-hover:text-[var(--brand)] active:cursor-grabbing"
              style={{ "--brand": brand } as React.CSSProperties}
            >
              <Icon size={36} aria-hidden />
            </m.span>
          </span>
          <span className="text-[0.75rem] text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">{name}</span>
        </li>
      ))}
    </ul>
  );
}
