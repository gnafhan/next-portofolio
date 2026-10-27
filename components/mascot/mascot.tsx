"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as m from "motion/react-m";
import { animate, useMotionValue, useReducedMotion, useTransform, useVelocity, type PanInfo } from "motion/react";
import { ArrowUp, X } from "lucide-react";
import { NafiFace, type Mood } from "./nafi-face";
import { Spotlight } from "./spotlight";
import { TOURS, type Step } from "./tours";
import { ask, friendly, getSession, type Turn } from "./agent-client";

const SIZE = 76;
const EDGE = 14;
const POS_KEY = "nafi-pos";
const HIDE_KEY = "nafi-hidden";
const HI_KEY = "nafi-hi";

const spring = { type: "spring" as const, stiffness: 260, damping: 24 };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const track = (name: string, props?: Record<string, string>) => {
  try {
    (window as unknown as { plausible?: (n: string, o?: { props?: Record<string, string> }) => void }).plausible?.(name, props ? { props } : undefined);
  } catch {}
};

/** Waits (after a page change) until the element exists and has a size. */
async function waitFor(sel: string, signal: AbortSignal, ms = 6000) {
  const t0 = performance.now();
  while (performance.now() - t0 < ms && !signal.aborted) {
    const el = document.querySelector(sel);
    if (el && el.getBoundingClientRect().width > 0) return el;
    await sleep(120);
  }
  return null;
}

type Msg = { from: "nafi" | "you"; text: string };

/**
 * Nafi lives in the corner of every page. Drag and throw it (it squashes when it lands and sticks to
 * the nearest edge), poke it, shake it, leave it alone long enough and it falls asleep. Tap it for
 * the chat panel; the shortcuts there run guided tours that fly Nafi to the thing it's talking about.
 */
export default function Mascot() {
  const router = useRouter();
  const pathname = usePathname();
  const path = useRef(pathname);
  useEffect(() => {
    path.current = pathname;
  }, [pathname]);
  const calm = useReducedMotion();

  // remembered spot (left/right edge + height), else bottom-right; client-only component, so window is there
  const [start] = useState(() => {
    let left = false;
    let fy = 0.8;
    try {
      const s = JSON.parse(sessionStorage.getItem(POS_KEY) ?? "null");
      if (s) ({ left, fy } = s);
    } catch {}
    const W = window.innerWidth;
    const H = window.innerHeight;
    return { x: left ? EDGE : W - SIZE - EDGE, y: clamp(fy * H, 76, H - SIZE - EDGE), below: H + 40 };
  });
  const x = useMotionValue(start.x);
  const y = useMotionValue(start.below);
  const vx = useVelocity(x);
  const vy = useVelocity(y);
  const tilt = useTransform(vx, (v) => clamp(v / 60, -16, 16));
  const stretch = useTransform([vx, vy], ([a, b]: number[]) => 1 + clamp(Math.hypot(a, b) / 5000, 0, 0.14));
  const squashX = useMotionValue(1);
  const squashY = useMotionValue(1);
  const scaleX = useTransform([squashX, stretch], ([s, t]: number[]) => s / Math.sqrt(t));
  const scaleY = useTransform([squashY, stretch], ([s, t]: number[]) => s * t);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const [hidden, setHidden] = useState(() => {
    try {
      return localStorage.getItem(HIDE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [mood, setMood] = useState<Mood>("idle");
  const [blink, setBlink] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [spot, setSpot] = useState<Element | null>(null);
  const [touring, setTouring] = useState(false);
  const [pointLeft, setPointLeft] = useState(false);
  // which way the speech bubble opens (towards the middle of the screen)
  const [bubbleLeft, setBubbleLeft] = useState(() => start.x > window.innerWidth / 2);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "nafi", text: "Hi, I'm Nafi! Ask me anything about Nafhan, or pick a tour:" }]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const turns = useRef<Turn[]>([]);
  const [panelPos, setPanelPos] = useState({ left: 0, top: 0 });

  const home = useRef({ x: start.x, y: start.y });
  const lastActive = useRef(0);
  const taps = useRef<number[]>([]);
  const shakes = useRef<{ t: number; dir: number }[]>([]);
  const abort = useRef<AbortController | null>(null);
  const moodRef = useRef<Mood>("idle");
  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);
  const dragging = useRef(false);

  // --- placement: remembered spot, else bottom-right
  const settle = useCallback(
    (tx: number, ty: number, save = true) => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const left = tx + SIZE / 2 < W / 2;
      const fx = left ? EDGE : W - SIZE - EDGE;
      const fy = clamp(ty, 76, H - SIZE - EDGE);
      setBubbleLeft(!left);
      animate(x, fx, spring);
      animate(y, fy, spring);
      if (save) {
        home.current = { x: fx, y: fy };
        try {
          sessionStorage.setItem(POS_KEY, JSON.stringify({ left, fy: fy / H }));
        } catch {}
      }
    },
    [x, y],
  );

  useEffect(() => {
    // pop up from below the screen
    animate(y, home.current.y, { type: "spring", stiffness: 180, damping: 16, delay: 0.2 });
    const onResize = () => settle(x.get(), y.get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [x, y, settle]);

  // --- eyes follow the cursor, blink, doze off when nothing happens
  useEffect(() => {
    lastActive.current = Date.now();
    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    const look = () => {
      raf = 0;
      const cx = x.get() + SIZE / 2;
      const cy = y.get() + SIZE / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(3, d / 60);
      px.set((dx / d) * k);
      py.set((dy / d) * k * 0.8);
    };
    const wake = () => {
      lastActive.current = Date.now();
      if (moodRef.current === "sleep") setMood("idle");
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      wake();
      if (!raf) raf = requestAnimationFrame(look);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("keydown", wake);

    let blinkT: ReturnType<typeof setTimeout>;
    const loop = () => {
      blinkT = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        loop();
      }, 2500 + Math.random() * 3500);
    };
    loop();
    const doze = setInterval(() => {
      if (Date.now() - lastActive.current > 45000 && moodRef.current === "idle" && !dragging.current) setMood("sleep");
    }, 5000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(blinkT);
      clearInterval(doze);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("keydown", wake);
    };
  }, [x, y, px, py]);

  // --- say hi once per visit
  const say = useCallback((text: string | null, ms = 4200) => {
    setBubble(text);
    if (text) setTimeout(() => setBubble((b) => (b === text ? null : b)), ms);
  }, []);
  const moodFor = useCallback((md: Mood, ms: number) => {
    setMood(md);
    setTimeout(() => setMood((cur) => (cur === md ? "idle" : cur)), ms);
  }, []);

  useEffect(() => {
    if (hidden) return;
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(HI_KEY);
      sessionStorage.setItem(HI_KEY, "1");
    } catch {}
    if (seen) return;
    const t = setTimeout(() => {
      moodFor("wave", 1600);
      say("Hi! Drag me around, or tap me for a tour.", 5000);
    }, 2200);
    return () => clearTimeout(t);
  }, [hidden, say, moodFor]);

  // --- panel follows Nafi
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const W = window.innerWidth;
      const pw = Math.min(340, W - 24);
      const left = clamp(x.get() + SIZE / 2 - pw / 2 + (x.get() > W / 2 ? -pw / 2 + 20 : pw / 2 - 20), 12, W - pw - 12);
      const above = y.get() > 400;
      setPanelPos({ left, top: above ? y.get() - 12 : y.get() + SIZE + 12 });
    };
    place();
    const u1 = x.on("change", place);
    const u2 = y.on("change", place);
    return () => {
      u1();
      u2();
    };
  }, [open, x, y]);

  // --- tours: change page, scroll, spotlight, fly next to the thing, talk
  const flyTo = (el: Element) => {
    const r = el.getBoundingClientRect();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const right = r.right + 12 + SIZE < W;
    const tx = right ? Math.min(r.right + 12, W - SIZE - 8) : Math.max(8, r.left - SIZE - 12);
    const ty = clamp(r.top + Math.min(r.height, 220) / 2 - SIZE / 2, 76, H - SIZE - 8);
    setPointLeft(right);
    setBubbleLeft(tx > W / 2);
    if (calm) {
      x.set(tx);
      y.set(ty);
    } else {
      animate(x, tx, { type: "spring", stiffness: 120, damping: 18 });
      animate(y, ty, { type: "spring", stiffness: 120, damping: 18 });
    }
  };

  const runSteps = async (steps: Step[]) => {
    abort.current?.abort();
    const ctl = new AbortController();
    abort.current = ctl;
    setTouring(true);
    setOpen(false);
    for (const s of steps) {
      if (ctl.signal.aborted) break;
      if (s.go && path.current !== s.go) {
        router.push(s.go);
        setMood("talk");
        say("One sec…", 1500);
      }
      const el = await waitFor(s.target, ctl.signal);
      if (!el || ctl.signal.aborted) continue;
      if (s.target === "main") {
        // a whole page (case study, post): no spotlight, just arrive and talk
        window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
        setMood("happy");
        if (s.say) say(s.say, 60000);
        await sleep(s.say ? 2200 + s.say.length * 32 : 1200);
        continue;
      }
      el.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
      await sleep(calm ? 100 : 750);
      if (ctl.signal.aborted) break;
      setSpot(el);
      flyTo(el);
      setMood("point");
      if (s.say) say(s.say, 60000);
      await sleep(s.hold ?? 2600 + s.say.length * 32);
    }
    setSpot(null);
    setBubble(null);
    setMood("happy");
    setTimeout(() => setMood("idle"), 1200);
    setTouring(false);
    settle(home.current.x, home.current.y, false);
  };

  const stopTour = () => {
    abort.current?.abort();
  };

  const startTour = (id: string) => {
    const tour = TOURS.find((t) => t.id === id);
    if (!tour) return;
    track("Nafi tour", { tour: id });
    setMsgs((ms) => [...ms, { from: "you", text: tour.label }, { from: "nafi", text: tour.intro }]);
    runSteps(tour.steps);
  };

  // --- free-form questions: the agent answers and may send steps to show
  const send = async () => {
    const q = draft.trim().slice(0, 500);
    if (!q || busy) return;
    setDraft("");
    setMsgs((ms) => [...ms, { from: "you", text: q }]);
    turns.current = [...turns.current, { role: "user" as const, content: q }].slice(-8);
    setBusy(true);
    setMood("talk");
    track("Nafi ask");
    try {
      const r = await ask(turns.current, path.current);
      turns.current = [...turns.current, { role: "assistant" as const, content: r.reply }].slice(-8);
      setMsgs((ms) => [...ms, { from: "nafi", text: r.reply }]);
      setMood("happy");
      if (r.actions?.length) {
        // give the visitor time to read the answer before Nafi sets off
        await sleep(Math.min(6000, 1500 + r.reply.length * 30));
        runSteps(r.actions);
      } else {
        setTimeout(() => setMood("idle"), 1200);
      }
    } catch (e) {
      setMsgs((ms) => [...ms, { from: "nafi", text: friendly(e) }]);
      moodFor("dizzy", 1600);
    } finally {
      setBusy(false);
    }
  };

  // warm up the proof-of-work while the visitor is still reading the panel
  useEffect(() => {
    if (open) getSession().catch(() => {});
  }, [open]);

  // --- pokes and drags
  const onTap = () => {
    if (touring) {
      stopTour();
      return;
    }
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 1200), now];
    if (taps.current.length >= 3) {
      taps.current = [];
      setOpen(false);
      moodFor("happy", 1400);
      say("Hehe, that tickles!", 1800);
      if (!calm) {
        animate(squashX, [1, 1.12, 0.94, 1.04, 1], { duration: 0.5 });
        animate(squashY, [1, 0.88, 1.06, 0.97, 1], { duration: 0.5 });
      }
      return;
    }
    setOpen((o) => {
      if (!o) track("Nafi open");
      return !o;
    });
    setBubble(null);
  };

  const onDragStart = () => {
    dragging.current = true;
    stopTour();
    setBubble(null);
    setMood("hover");
    shakes.current = [];
  };
  const onDrag = (_: unknown, info: PanInfo) => {
    const dir = Math.sign(info.velocity.x);
    if (Math.abs(info.velocity.x) < 700 || !dir) return;
    const now = Date.now();
    const last = shakes.current[shakes.current.length - 1];
    if (!last || last.dir !== dir) shakes.current = [...shakes.current.filter((s) => now - s.t < 900), { t: now, dir }];
    if (shakes.current.length >= 5 && moodRef.current !== "dizzy") {
      setMood("dizzy");
      say("Woah… everything's spinning", 2200);
    }
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    dragging.current = false;
    // a little throw: carry the release speed, then land on the nearest edge with a squash
    settle(x.get() + info.velocity.x * 0.18, y.get() + info.velocity.y * 0.18);
    if (!calm) {
      animate(squashX, [1, 1.18, 0.94, 1], { duration: 0.45, delay: 0.18 });
      animate(squashY, [1, 0.82, 1.06, 1], { duration: 0.45, delay: 0.18 });
    }
    if (moodRef.current === "dizzy") setTimeout(() => setMood("idle"), 2200);
    else setMood("idle");
  };

  const hide = () => {
    setHidden(true);
    setOpen(false);
    stopTour();
    try {
      localStorage.setItem(HIDE_KEY, "1");
    } catch {}
    track("Nafi hide");
  };
  const unhide = () => {
    setHidden(false);
    try {
      localStorage.removeItem(HIDE_KEY);
    } catch {}
    settle(home.current.x, home.current.y);
    moodFor("wave", 1400);
  };

  if (hidden) {
    return (
      <button
        type="button"
        onClick={unhide}
        className="nafi-root lg fixed bottom-4 right-0 z-[50] flex items-center gap-1.5 rounded-l-full py-1.5 pl-3 pr-2 text-[0.8rem] text-ink-2"
        aria-label="Bring Nafi back"
      >
        <span className="nafi-body block size-4" /> Nafi
      </button>
    );
  }

  return (
    <>
      <Spotlight target={spot} />
      <m.div
        className="nafi-root group fixed left-0 top-0 z-[50] touch-none select-none"
        style={{ x, y, width: SIZE, height: SIZE }}
        drag
        dragMomentum={false}
        dragElastic={0}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onTap={onTap}
        onHoverStart={() => moodRef.current === "idle" && setMood("hover")}
        onHoverEnd={() => moodRef.current === "hover" && setMood("idle")}
      >
        <m.div style={{ rotate: tilt, scaleX, scaleY, transformOrigin: "50% 90%" }}>
          <button
            type="button"
            className={`${calm ? "" : "nafi-bob"} block cursor-grab rounded-full active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]`}
            aria-label={touring ? "Stop the tour" : open ? "Close Nafi's panel" : "Open Nafi, the site guide"}
            aria-expanded={open}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTap();
              }
            }}
          >
            <NafiFace mood={mood} blink={blink} px={px} py={py} pointLeft={pointLeft} />
          </button>
        </m.div>

        {/* hide */}
        {!touring && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              hide();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="lg absolute -top-1 right-0 flex size-5 items-center justify-center rounded-full text-ink-3 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            aria-label="Hide Nafi"
          >
            <X size={11} aria-hidden />
          </button>
        )}

        {/* speech bubble */}
        {bubble && (
          <m.div
            key={bubble}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`lg-sm pointer-events-none absolute bottom-[calc(100%+6px)] w-max max-w-[240px] rounded-2xl px-3 py-2 text-[0.85rem] leading-snug ${
              bubbleLeft ? "right-0" : "left-0"
            }`}
            role="status"
          >
            {bubble}
            {touring && <span className="mt-1 block text-[0.75rem] text-ink-3">Tap me to stop</span>}
          </m.div>
        )}
      </m.div>

      {/* chat panel */}
      {open && (
        <m.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-static fixed z-[51] flex w-[min(340px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl"
          style={{ left: panelPos.left, top: panelPos.top, translate: y.get() > 400 ? "0 -100%" : undefined }}
          role="dialog"
          aria-label="Nafi, site guide"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <div className="text-[0.95rem] font-medium">Nafi</div>
              <div className="text-[0.78rem] text-ink-3">Nafhan&apos;s site guide</div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="lg flex size-7 items-center justify-center rounded-full" aria-label="Close">
              <X size={14} aria-hidden />
            </button>
          </div>
          <div className="max-h-[220px] space-y-2 overflow-y-auto px-4 py-3" aria-live="polite">
            {msgs.map((ms, i) => (
              <div
                key={i}
                className={`w-fit max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-[0.88rem] leading-snug ${ms.from === "you" ? "lg-accent ml-auto" : "lg-sm"}`}
              >
                {ms.text}
              </div>
            ))}
            {busy && (
              <div className="lg-sm flex w-fit gap-1 rounded-2xl px-3 py-2.5" aria-label="Nafi is thinking">
                {[0, 1, 2].map((d) => (
                  <m.span
                    key={d}
                    className="size-1.5 rounded-full bg-[var(--ink-3)]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                  />
                ))}
              </div>
            )}
          </div>
          {msgs.length <= 3 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {TOURS.map((t) => (
                <button key={t.id} type="button" onClick={() => startTour(t.id)} className="lg rounded-full px-3 py-1.5 text-[0.82rem]">
                  {t.label}
                </button>
              ))}
            </div>
          )}
          <form
            className="flex items-center gap-2 border-t border-line px-3 py-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={500}
              placeholder="Ask about his work, skills, certificates…"
              aria-label="Ask Nafi"
              className="min-w-0 flex-1 bg-transparent px-1 text-[0.9rem] outline-none placeholder:text-ink-3"
              autoFocus
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              className="btn-primary flex size-8 shrink-0 items-center justify-center rounded-full disabled:opacity-40"
              aria-label="Send"
            >
              <ArrowUp size={15} aria-hidden />
            </button>
          </form>
          <div className="px-4 pb-2.5 text-[0.72rem] leading-snug text-ink-3">
            AI answers from this site only. Chats are kept anonymously for 7 days to improve Nafi.
          </div>
        </m.div>
      )}
    </>
  );
}
