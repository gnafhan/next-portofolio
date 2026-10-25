"use client";

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

const STACK: { name: string; Icon: IconType }[] = [
  { name: "Python", Icon: SiPython },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "React", Icon: SiReact },
  { name: "FastAPI", Icon: SiFastapi },
  { name: "Go", Icon: SiGo },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "LangGraph", Icon: SiLangchain },
  { name: "Claude", Icon: SiAnthropic },
  { name: "Gemini", Icon: SiGooglegemini },
  { name: "Docker", Icon: SiDocker },
  { name: "Terraform", Icon: SiTerraform },
];

/** Floating tech-stack icons (the bobbing row from the 2024 site). */
export function TechStack() {
  return (
    <ul className="grid grid-cols-4 place-items-center gap-y-10 sm:grid-cols-6 lg:grid-cols-12" aria-label="Tech I work with">
      {STACK.map(({ name, Icon }, i) => (
        <li key={name} className="group flex flex-col items-center gap-2" title={name}>
          <span
            className="text-ink-2 transition-colors group-hover:text-ink"
            style={{ animation: `bob 3.2s ease-in-out ${(i % 4) * -0.8}s infinite` }}
          >
            <Icon size={34} aria-hidden />
          </span>
          <span className="text-[0.75rem] text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">{name}</span>
        </li>
      ))}
    </ul>
  );
}
