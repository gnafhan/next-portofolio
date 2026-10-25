"use client";

import type { IconType } from "react-icons";
import {
  SiClaude,
  SiDocker,
  SiFastapi,
  SiGo,
  SiGooglegemini,
  SiLangchain,
  SiModelcontextprotocol,
  SiNestjs,
  SiNextdotjs,
  SiOpenapiinitiative,
  SiPostgresql,
  SiPwa,
  SiPython,
  SiReact,
  SiRedis,
  SiSupabase,
  SiTailwindcss,
  SiTanstack,
  SiTraefikproxy,
  SiTypeorm,
  SiTypescript,
  SiVercel,
  SiFirebase,
} from "react-icons/si";
import { Bot, Code2, ListChecks, MessageSquareText, Zap } from "lucide-react";

type AnyIcon = IconType | typeof Bot;

const ICONS: Record<string, AnyIcon> = {
  python: SiPython,
  fastapi: SiFastapi,
  langgraph: SiLangchain,
  postgresql: SiPostgresql,
  pgvector: SiPostgresql,
  gemini: SiGooglegemini,
  genkit: SiFirebase,
  redis: SiRedis,
  react: SiReact,
  "claude code": SiClaude,
  claude: SiClaude,
  mcp: SiModelcontextprotocol,
  "it's a plan": ListChecks,
  typescript: SiTypescript,
  nestjs: SiNestjs,
  typeorm: SiTypeorm,
  "next.js": SiNextdotjs,
  "tanstack query": SiTanstack,
  openapi: SiOpenapiinitiative,
  go: SiGo,
  fiber: Zap,
  pwa: SiPwa,
  docker: SiDocker,
  traefik: SiTraefikproxy,
  "tailwind css": SiTailwindcss,
  supabase: SiSupabase,
  vercel: SiVercel,
  "llm agents": Bot,
  "prompt design": MessageSquareText,
};

/** Glass chip with a monochrome logo of the tool. */
export function TechChip({ name, className = "" }: { name: string; className?: string }) {
  const Icon = ICONS[name.toLowerCase()] ?? Code2;
  return (
    <span className={`lg-sm inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.72rem] text-ink-2 ${className}`}>
      <Icon size={11} aria-hidden className="shrink-0 text-ink" />
      {name}
    </span>
  );
}
