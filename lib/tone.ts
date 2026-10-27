import type { Tone } from "@/components/icons";

const tones: Tone[] = ["blue", "green", "orange", "violet"];
export function toneFor(i: number): Tone {
  return tones[(Math.max(1, i) - 1) % tones.length];
}
