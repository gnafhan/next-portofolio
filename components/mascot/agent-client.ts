import type { Step } from "./tours";

/** Talks to the Nafi agent (services/agent). The proof-of-work runs once per 30-minute session. */
const BASE = process.env.NEXT_PUBLIC_AGENT_URL ?? "https://agent.nafhan.com";
const KEY = "nafi-session";

export class AgentError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

type Session = { token: string; expiresAt: number };

async function newSession(): Promise<Session> {
  const ch = await fetch(`${BASE}/challenge`).then((r) => r.json());
  if (!ch?.challenge) throw new AgentError(ch?.error ?? "challenge");
  // the solver loads only when a session is first needed
  const { solveChallenge } = await import("altcha-lib/v1");
  const sol = await solveChallenge(ch.challenge, ch.salt, ch.algorithm, ch.maxnumber).promise;
  if (!sol) throw new AgentError("challenge");
  const altcha = btoa(JSON.stringify({ algorithm: ch.algorithm, challenge: ch.challenge, number: sol.number, salt: ch.salt, signature: ch.signature }));
  const r = await fetch(`${BASE}/session`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ altcha }) });
  const s = await r.json();
  if (!r.ok || !s?.token) throw new AgentError(s?.error ?? "session");
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
  return s;
}

let pending: Promise<Session> | null = null;
export function getSession(fresh = false): Promise<Session> {
  if (!fresh) {
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as Session | null;
      if (s && s.expiresAt - 60_000 > Date.now()) return Promise.resolve(s);
    } catch {}
  }
  pending ??= newSession().finally(() => (pending = null));
  return pending;
}

export type Turn = { role: "user" | "assistant"; content: string };
export type Reply = { reply: string; actions: Step[]; left: number };

export async function ask(messages: Turn[], path: string): Promise<Reply> {
  const send = (s: Session) =>
    fetch(`${BASE}/chat`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${s.token}` },
      body: JSON.stringify({ messages: messages.slice(-8), path }),
    });
  let r = await send(await getSession());
  let d = await r.json().catch(() => ({}));
  // expired token, or this session used up its questions: start a fresh session once and retry
  if (r.status === 401 || d?.error === "session_limit") {
    r = await send(await getSession(true));
    d = await r.json().catch(() => ({}));
  }
  if (!r.ok) throw new AgentError(d?.error ?? "upstream");
  return d as Reply;
}

export function friendly(e: unknown) {
  const code = e instanceof AgentError ? e.code : "network";
  if (code === "slow_down") return "Whoa, slow down a little! Ask me again in a minute.";
  if (code === "daily_limit") return "I've talked a lot today! Try again tomorrow, or email Nafhan directly.";
  if (code === "resting") return "I'm resting right now. The tours still work, though!";
  return "Oops, I couldn't reach my brain just now. Try again in a moment?";
}
