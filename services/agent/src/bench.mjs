/**
 * Latency benchmark for candidate models with the real prompt and forced `respond` tool.
 *   docker exec -e MODELS=ocg/a,ocg/b nafhan-agent node src/bench.mjs
 */
import fs from "node:fs";
import { buildPrompt } from "./server.mjs";

const k = JSON.parse(fs.readFileSync(new URL("../knowledge.json", import.meta.url), "utf8"));
const P = buildPrompt(k);
const base = (process.env.LLM_BASE_URL || "").replace(/\/$/, "");
const models = (process.env.MODELS || process.env.LLM_MODEL).split(",");
const extra = process.env.EXTRA ? JSON.parse(process.env.EXTRA) : {};
const qs = ["What certificates does he have from Google?", "Apa project AI yang pernah dia bikin?"];

for (const model of models) {
  for (const q of qs) {
    const t0 = Date.now();
    try {
      const r = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${process.env.LLM_API_KEY}` },
        body: JSON.stringify({
          model,
          stream: false,
          max_tokens: 1800,
          messages: [{ role: "system", content: P.system }, { role: "user", content: q }],
          tools: P.tools,
          tool_choice: { type: "function", function: { name: "respond" } },
          ...extra,
        }),
        signal: AbortSignal.timeout(40000),
      });
      const d = await r.json();
      const m = d.choices?.[0]?.message ?? {};
      const call = (m.tool_calls || [])[0];
      let args = {};
      try {
        args = JSON.parse(call?.function?.arguments || "{}");
      } catch {}
      const u = d.usage || {};
      console.log(
        `${model.padEnd(26)} ${String(Date.now() - t0).padStart(6)}ms  http ${r.status}  in ${u.prompt_tokens ?? "?"} out ${u.completion_tokens ?? "?"} reason ${u.completion_tokens_details?.reasoning_tokens ?? "?"}  show ${Array.isArray(args.show) ? args.show.length : "-"}  ${(args.text || m.content || JSON.stringify(d.error || "")).slice(0, 70)}`,
      );
    } catch (e) {
      console.log(`${model.padEnd(26)} ${String(Date.now() - t0).padStart(6)}ms  ERROR ${e.message}`);
    }
  }
}
process.exit(0);
