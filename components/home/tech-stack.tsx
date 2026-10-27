"use client";

import * as m from "motion/react-m";
import type { IconType } from "react-icons";
import { SiClaude, SiHuggingface, SiLangchain, SiLanggraph, SiOllama, SiQdrant, SiSupabase, SiWeightsandbiases } from "react-icons/si";
import { AiCohere, AiLangfuse, AiLangSmith, AiLlamaIndex } from "../ai-logos";

// The AI-engineering toolbox: agents, models, retrieval, and evals/observability.
// brand: hover colour; monochrome brands fall back to the text colour.
const STACK: { name: string; Icon: IconType; brand: string }[] = [
  { name: "LangGraph", brand: "var(--ink)", Icon: SiLanggraph },
  { name: "LangChain", brand: "#1C3C3C", Icon: SiLangchain },
  { name: "LlamaIndex", brand: "var(--ink)", Icon: AiLlamaIndex },
  { name: "Claude", brand: "#D97757", Icon: SiClaude },
  { name: "Cohere", brand: "#39594D", Icon: AiCohere },
  { name: "Hugging Face", brand: "#FFB000", Icon: SiHuggingface },
  { name: "Ollama", brand: "var(--ink)", Icon: SiOllama },
  { name: "Supabase", brand: "#3ECF8E", Icon: SiSupabase },
  { name: "Qdrant", brand: "#DC244C", Icon: SiQdrant },
  { name: "LangSmith", brand: "#1C3C3C", Icon: AiLangSmith },
  { name: "Langfuse", brand: "#FF5D5F", Icon: AiLangfuse },
  { name: "Weights & Biases", brand: "#FFBE00", Icon: SiWeightsandbiases },
];

/** Floating tech-stack icons (the bobbing row from the 2024 site): hover for colour, drag to toss. */
export function TechStack() {
  return (
    <ul className="grid grid-cols-4 place-items-center gap-y-10 sm:grid-cols-6 lg:grid-cols-12" aria-label="AI engineering tools I work with">
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
