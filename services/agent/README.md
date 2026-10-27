# Nafi agent

The AI behind Nafi, the mascot on nafhan.com. It answers from the site's public content only
(`/agent/index.json`, built by the Next app) and tells the browser what to show (scroll, spotlight,
change page). Runs on vps-nafhan behind Traefik at `agent.nafhan.com`; the model comes from the
9router gateway on the same VPS (`ai_internal` network), currently OpenCode Go `ocg/glm-5.2`.

## Endpoints
- `GET /challenge` → ALTCHA proof-of-work challenge (the browser solves it invisibly)
- `POST /session` `{ altcha }` → session token (30 min); each solution opens one session
- `POST /chat` `Authorization: Bearer <token>` `{ messages, path }` → `{ reply, actions, left }`
- `GET /health`

## Limits (env, defaults)
Traefik: 30 req/min per IP (burst 20), 16 KB bodies. App: `CHAT_PER_MIN=6`, `CHAT_PER_DAY=40` per IP,
`CHAT_PER_SESSION=25`, `CHAT_GLOBAL_PER_DAY=1500`, `CHALLENGE_PER_MIN=20`, `MAX_INPUT_CHARS=500`,
`MAX_HISTORY=8`. Kill switch: `AGENT_DISABLED=1` in `.env`, or `redis-cli set agent:off 1`.

## Reset today's limits (e.g. after heavy testing from one IP)
`ssh vps-nafhan 'R="docker exec nafhan-agent-redis redis-cli"; for k in $($R --scan --pattern "rl:*"); do $R del "$k"; done'`

## Privacy
IPs are only stored hashed with a daily-rotating salt (rate-limit keys). Transcripts (question,
answer, page, actions, no IP or session id) live in Redis lists `transcripts:YYYY-MM-DD` for
`TRANSCRIPT_DAYS=7` days. Read them:
`docker exec nafhan-agent-redis redis-cli lrange transcripts:$(date +%F) 0 20`

## .env (on the VPS, mode 600)
`AGENT_SECRET` (random, ≥32 chars), `LLM_BASE_URL`, `LLM_API_KEY` (9router key `nafhan-agent`),
`LLM_MODEL`, `LLM_FALLBACK_MODEL`, `LLM_EXTRA` (JSON merged into each request, e.g. `{"thinking":{"type":"disabled"}}`), `ALLOWED_ORIGINS`, `ALLOWED_ORIGIN_RE` (Vercel previews),
`KNOWLEDGE_URL=https://nafhan.com/agent/index.json`.

## Choosing a model
`docker exec -e MODELS=ocg/a,ocg/b [-e EXTRA='{...}'] nafhan-agent node src/bench.mjs` times candidates with the real
prompt and tool. Oct 2026: `ocg/glm-5.2` with thinking disabled ~2.8 s (vs ~9 s with reasoning), fallback
`ocg/glm-5.3-flash` ~3.5 s.

## Deploy
From the repo root, with the dev server running on :3100 (or point at production):
```
curl -s http://localhost:3100/agent/index.json > services/agent/knowledge.json
rsync -a --exclude node_modules --exclude knowledge.json.bak services/agent/ vps-nafhan:/root/nafhan-agent/
ssh vps-nafhan 'cd /root/nafhan-agent && docker compose up -d --build'
```
Once the new site is live the agent also refreshes `KNOWLEDGE_URL` every 10 minutes.
