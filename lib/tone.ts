const tones = ["accent", "sage", "sand", "rose"] as const;
export type Tone = (typeof tones)[number];
export function toneFor(i: number): Tone {
  return tones[(Math.max(1, i) - 1) % tones.length];
}
