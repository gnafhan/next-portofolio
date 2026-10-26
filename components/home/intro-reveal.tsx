"use client";

import { useEffect, useRef } from "react";
import { rasterize } from "./rasterize";

/*
 * Full-screen liquid-glass intro (WebGL, no libraries).
 *
 * 1. The screen fills with a backdrop: a halftone dot grid and scattered fragments of messy
 *    work ("kopi 25rb", "PR #42", "N/A"...). Large liquid-glass blobs float over it, refracting
 *    and frosting what is behind them, melting into each other and splitting apart.
 * 2. The blobs flow to the centre and merge into a glass N; everything else is gone.
 * 3. Scroll to open: zoom into the N. Inside it the real hero shows through, until the N covers
 *    the screen and the page takes over.
 *
 * An inline script decides before first paint whether to show it (WebGL available, no reduced
 * motion, once per tab session), so there is no flash of content followed by a cover.
 */

// Skipped without a real GPU (software renderers like SwiftShader would make it stutter).
const GATE = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(sessionStorage.getItem('intro-seen'))return;var g=document.createElement('canvas').getContext('webgl');if(!g)return;var i=g.getExtension('WEBGL_debug_renderer_info');var r=i?String(g.getParameter(i.UNMASKED_RENDERER_WEBGL)):'';if(/swiftshader|llvmpipe|software/i.test(r))return;d.dataset.intro='on';}catch(e){}})();`;

const LOGO_H = 290;
const CENTER = { x: 228, y: 249 };
const FOCUS = { x: 232, y: 240 }; // inside the diagonal stroke
const CAPS: [number, number, number, number][] = [
  [95, 340, 185, 140], // blue
  [165, 130, 300, 350], // red
  [285, 345, 365, 145], // yellow
];
const CAP_R = 25;
const ZOOM = 70;
const BLOBS = 10;
const LIQUID_END = 3.9; // seconds until only the N is left

const FRAGMENTS: [string, number, number, string?][] = [
  ["kopi 25rb", 0.07, 0.16, "#f8b916"],
  ["PR #42 needs a review", 0.66, 0.1],
  ["12/10/26", 0.12, 0.74],
  ["N/A", 0.88, 0.62, "#e94436"],
  ["upload lab module?", 0.03, 0.44],
  ["Rp1,2jt", 0.82, 0.34],
  ["the export is empty, help", 0.58, 0.84, "#557cbe"],
  ["3 hours of grading", 0.24, 0.9],
  ["GRAB 350rb", 0.86, 0.88],
  ["slides for Friday pls", 0.3, 0.07],
  ["??? missing date", 0.44, 0.94],
  ["unread: 47", 0.9, 0.12, "#e94436"],
  ["invoice_final_v3.xlsx", 0.68, 0.48],
  ["voice note 0:42", 0.15, 0.58, "#557cbe"],
];

const VERT = `attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }`;

const FRAG = `
precision highp float;
uniform sampler2D uBg;
uniform sampler2D uHero;
uniform vec2 uRes;
uniform float uDpr;
uniform vec3 uBlob[${BLOBS}];
uniform vec2 uA[3];
uniform vec2 uB[3];
uniform float uCapR;
uniform float uNW;
uniform float uHeroMix;
uniform float uDark;
varying vec2 vUv;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float sdCap(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
float nShape(vec2 p) {
  float n = sdCap(p, uA[0], uB[0], uCapR);
  n = smin(n, sdCap(p, uA[1], uB[1], uCapR), 6.0 * uDpr);
  n = smin(n, sdCap(p, uA[2], uB[2], uCapR), 6.0 * uDpr);
  return n + (1.0 - uNW) * 600.0 * uDpr;
}
float scene(vec2 p) {
  float d = 1e5;
  for (int i = 0; i < ${BLOBS}; i++) {
    vec3 b = uBlob[i];
    if (b.z > 0.5) d = smin(d, length(p - b.xy) - b.z, 46.0 * uDpr);
  }
  return smin(d, nShape(p), 60.0 * uDpr * (1.0 - uNW) + 0.5);
}
vec3 src(vec2 px) {
  vec2 uv = clamp(px / uRes, 0.0, 1.0);
  return mix(texture2D(uBg, uv).rgb, texture2D(uHero, uv).rgb, uHeroMix);
}

void main() {
  vec2 px = vec2(vUv.x * uRes.x, (1.0 - vUv.y) * uRes.y);
  float d = scene(px);
  vec3 bg = texture2D(uBg, px / uRes).rgb;

  // soft contact shadow from the same distance (one scene evaluation for pixels outside the glass)
  float sh = (1.0 - smoothstep(0.0, 30.0 * uDpr, d)) * (uDark > 0.5 ? 0.38 : 0.08);
  vec3 outside = bg * (1.0 - sh);
  if (d > 1.5) { gl_FragColor = vec4(outside, 1.0); return; }

  float e = 1.5 * uDpr;
  vec2 n = normalize(vec2(scene(px + vec2(e, 0.0)) - scene(px - vec2(e, 0.0)),
                          scene(px + vec2(0.0, e)) - scene(px - vec2(0.0, e))) + 1e-6);
  float bevelW = 36.0 * uDpr;
  float bevel = 1.0 - clamp(-d / bevelW, 0.0, 1.0);

  // thick-glass refraction near the rim, a little frosting, a hint of colour split
  vec2 sp = px - n * pow(bevel, 1.3) * 58.0 * uDpr - n * (1.0 - bevel) * 10.0 * uDpr;
  float fr = 0.8 * uDpr * (1.0 - uHeroMix);
  vec3 c = src(sp) * 0.4
         + src(sp + vec2(fr, 0.0)) * 0.15 + src(sp - vec2(fr, 0.0)) * 0.15
         + src(sp + vec2(0.0, fr)) * 0.15 + src(sp - vec2(0.0, fr)) * 0.15;
  vec2 ca = n * pow(bevel, 2.0) * 4.0 * uDpr;
  c.r = mix(c.r, src(sp + ca).r, 0.7);
  c.b = mix(c.b, src(sp - ca).b, 0.7);

  // body tint: neutral glass, the N picks up its stroke colours
  float d0 = sdCap(px, uA[0], uB[0], uCapR);
  float d1 = sdCap(px, uA[1], uB[1], uCapR);
  float d2 = sdCap(px, uA[2], uB[2], uCapR);
  vec3 tint = d0 < d1 && d0 < d2 ? vec3(0.33, 0.49, 0.75) : (d1 < d2 ? vec3(0.91, 0.27, 0.21) : vec3(0.97, 0.73, 0.09));
  c = mix(c, vec3(1.0), uDark > 0.5 ? 0.05 : 0.03);
  c = mix(c, tint, 0.13 * uNW * (1.0 - uHeroMix));

  // rim light, specular highlight, inner shade
  // thickness: a slightly darker band inside the edge, then a thin bright rim on the very edge
  c -= pow(bevel, 2.5) * (uDark > 0.5 ? 0.04 : 0.11);
  c += pow(bevel, 9.0) * (uDark > 0.5 ? 0.45 : 0.35);
  c += pow(max(dot(n, normalize(vec2(-0.55, -0.85))), 0.0), 10.0) * pow(bevel, 1.5) * 0.75;
  c -= pow(max(dot(n, normalize(vec2(0.55, 0.85))), 0.0), 3.0) * pow(bevel, 2.0) * 0.12;

  float a = 1.0 - smoothstep(-1.0, 1.5, d);
  gl_FragColor = vec4(mix(outside, c, a), 1.0);
}
`;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function css(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

/** The scene behind the glass: dot grid plus scattered fragments of messy work. */
function drawBackdrop(W: number, H: number, dpr: number) {
  const c = document.createElement("canvas");
  c.width = Math.round(W * dpr);
  c.height = Math.round(H * dpr);
  const ctx = c.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = css("--bg", "#18181b");
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = css("--ink-3", "#9a9aa4");
  ctx.globalAlpha = 0.28;
  for (let y = 11; y < H; y += 22) for (let x = 11; x < W; x += 22) ctx.fillRect(x - 1, y - 1, 2, 2);
  ctx.globalAlpha = 1;
  const font = getComputedStyle(document.body).fontFamily;
  ctx.font = `500 15px ${font}`;
  ctx.textBaseline = "middle";
  for (const [text, fx, fy, dot] of FRAGMENTS) {
    const tw = ctx.measureText(text).width;
    const w = tw + (dot ? 40 : 28);
    const h = 34;
    const x = Math.min(W - w - 8, Math.max(8, fx * W));
    const y = Math.min(H - h - 8, Math.max(8, fy * H));
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 17);
    ctx.fillStyle = css("--surface-2", "#27272a");
    ctx.fill();
    ctx.strokeStyle = css("--line-strong", "#3f3f46");
    ctx.lineWidth = 1;
    ctx.stroke();
    let tx = x + 14;
    if (dot) {
      ctx.beginPath();
      ctx.arc(x + 16, y + h / 2, 4, 0, Math.PI * 2);
      ctx.fillStyle = dot;
      ctx.fill();
      tx = x + 26;
    }
    ctx.fillStyle = css("--ink-2", "#a1a1aa");
    ctx.fillText(text, tx, y + h / 2 + 1);
  }
  return c;
}

/** The hero as it will look once the intro is gone, at its viewport position. */
function drawHero(W: number, H: number, dpr: number) {
  const c = document.createElement("canvas");
  c.width = Math.round(W * dpr);
  c.height = Math.round(H * dpr);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = css("--bg", "#18181b");
  ctx.fillRect(0, 0, c.width, c.height);
  const hero = document.querySelector<HTMLElement>("main section");
  if (hero) {
    const r = hero.getBoundingClientRect();
    const shot = rasterize(hero, dpr, document.querySelector(".intro-cover") ?? document.createElement("div"));
    ctx.drawImage(shot, r.left * dpr, r.top * dpr);
  }
  return c;
}

export function IntroReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const finish = useRef<() => void>(() => {});

  useEffect(() => {
    const html = document.documentElement;
    const canvas = canvasRef.current;
    if (html.dataset.intro !== "on" || !canvas) return;
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";

    let raf = 0;
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      detach();
      cancelAnimationFrame(raf);
      html.style.overflow = "";
      html.style.removeProperty("--intro-p");
      delete html.dataset.intro;
    };

    const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) {
      release();
      return;
    }
    // if the GPU drops the context, get out of the way rather than leave a blank cover
    const onLost = () => {
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
      release();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    // --- GL program
    const compile = (type: number, srcText: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, srcText);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      release();
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u = {
      res: U("uRes"), dpr: U("uDpr"), blob: U("uBlob"), a: U("uA"), b: U("uB"), capR: U("uCapR"),
      nw: U("uNW"), heroMix: U("uHeroMix"), dark: U("uDark"), bg: U("uBg"), hero: U("uHero"),
    };
    const makeTex = (unit: number, img: TexImageSource) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      return t;
    };

    // --- sizes and textures
    let W = 0, H = 0, dpr = 1;
    let bgTex: WebGLTexture | null = null;
    let heroTex: WebGLTexture | null = null;
    const setup = () => {
      // full-screen shader: render at ≤1x (0.75x on phones) and let CSS upscale; glass hides the softness
      dpr = Math.min(window.devicePixelRatio || 1, 1) * (window.innerWidth < 768 ? 0.75 : 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (bgTex) gl.deleteTexture(bgTex);
      bgTex = makeTex(0, drawBackdrop(W, H, dpr));
      gl.uniform1i(u.bg, 0);
      gl.uniform1i(u.hero, 1);
      if (heroTex) loadHero(); // re-snapshot after a resize
      else {
        // placeholder until the hero is needed (it is only visible once the zoom starts)
        heroTex = makeTex(1, drawBackdrop(1, 1, 1));
      }
    };
    let heroReady = false;
    const loadHero = () => {
      if (heroTex) gl.deleteTexture(heroTex);
      heroTex = makeTex(1, drawHero(W, H, dpr));
      heroReady = true;
      gl.activeTexture(gl.TEXTURE0);
    };
    const ensureHero = () => {
      if (!heroReady) loadHero();
    };

    // --- blobs: spread over the whole screen, each with its own drift
    const seeds = Array.from({ length: BLOBS }, (_, i) => ({
      gx: ((i * 0.618034) % 1) * 0.84 + 0.08,
      gy: ((i * 0.381966 + 0.21) % 1) * 0.7 + 0.15,
      size: 0.075 + ((i * 7) % 5) * 0.02,
      ph: i * 1.7,
      w1: 0.35 + (i % 3) * 0.12,
      w2: 0.28 + (i % 4) * 0.09,
      cap: i % 3,
      along: ((i * 0.37) % 1) * 0.8 + 0.1,
    }));

    // --- input
    let target = 0;
    let p = 0;
    let done = false;
    let touchY: number | null = null;
    let t0 = performance.now();
    const lt = () => (performance.now() - t0) / 1000;

    const end = () => {
      if (done) return;
      done = true;
      target = 1;
      detach();
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
      setTimeout(release, 700);
    };
    finish.current = end;

    const push = (delta: number) => {
      ensureHero();
      if (lt() < LIQUID_END) t0 -= (LIQUID_END - lt()) * 1000; // scrolling early fast-forwards the liquid part
      target = clamp01(target + delta);
      if (target >= 0.85) end();
    };
    function onWheel(e: WheelEvent) {
      if (done) return;
      e.preventDefault();
      push(e.deltaY / 1400);
    }
    function onTouchStart(e: TouchEvent) {
      touchY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      if (done || touchY === null) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      push((touchY - y) / 700);
      touchY = y;
    }
    function onKey(e: KeyboardEvent) {
      if (done) return;
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        push(0.25);
      }
      if (e.key === "Escape") end();
    }
    function detach() {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    const blobData = new Float32Array(BLOBS * 3);
    const capA = new Float32Array(6);
    const capB = new Float32Array(6);

    let lastP = -1;
    let heroQueued = false;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const t = lt();
      // after the N has formed, only redraw while the zoom is moving
      if (t > LIQUID_END + 0.6 && Math.abs(target - p) < 0.0005 && Math.abs(p - lastP) < 0.0005 && !done) {
        if (!heroReady && !heroQueued) {
          heroQueued = true;
          const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
          (ric ?? ((cb: () => void) => setTimeout(cb, 200)))(ensureHero);
        }
        return;
      }
      lastP = p;
      const minWH = Math.min(W, H);

      // N placement (zoom phase moves the anchor into the diagonal stroke and scales up)
      p += (target - p) * 0.12;
      if (done && p > 0.999) p = 1;
      const ez = easeInOut(p);
      const S = ((minWH * 0.44) / LOGO_H) * Math.exp(Math.log(ZOOM) * ez);
      const ax = CENTER.x + (FOCUS.x - CENTER.x) * Math.min(1, ez * 2);
      const ay = CENTER.y + (FOCUS.y - CENTER.y) * Math.min(1, ez * 2);
      const toScreen = (lx: number, ly: number) => [W / 2 + (lx - ax) * S, H / 2 + (ly - ay) * S];
      CAPS.forEach(([x1, y1, x2, y2], k) => {
        const [sx1, sy1] = toScreen(x1, y1);
        const [sx2, sy2] = toScreen(x2, y2);
        capA[k * 2] = sx1 * dpr;
        capA[k * 2 + 1] = sy1 * dpr;
        capB[k * 2] = sx2 * dpr;
        capB[k * 2 + 1] = sy2 * dpr;
      });

      // liquid phase timeline
      const converge = easeInOut(clamp01((t - 2.4) / 1.1));
      const nW = easeInOut(clamp01((t - 2.9) / 0.7));
      const vanish = clamp01((t - 3.2) / 0.6);
      seeds.forEach((s, i) => {
        const pop = easeOut(clamp01((t - i * 0.07) / 0.6));
        const fx = s.gx * W + Math.sin(t * s.w1 + s.ph) * minWH * 0.07;
        const fy = s.gy * H + Math.cos(t * s.w2 + s.ph) * minWH * 0.07;
        const [x1, y1, x2, y2] = CAPS[s.cap];
        const [tx, ty] = toScreen(x1 + (x2 - x1) * s.along, y1 + (y2 - y1) * s.along);
        const x = fx + (tx - fx) * converge;
        const y = fy + (ty - fy) * converge;
        const rFloat = s.size * minWH * (1 + 0.12 * Math.sin(t * 1.3 + s.ph));
        const r = (rFloat + (CAP_R * S * 0.9 - rFloat) * converge) * pop * (1 - vanish);
        blobData[i * 3] = x * dpr;
        blobData[i * 3 + 1] = y * dpr;
        blobData[i * 3 + 2] = r * dpr;
      });

      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.dpr, dpr);
      gl.uniform3fv(u.blob, blobData);
      gl.uniform2fv(u.a, capA);
      gl.uniform2fv(u.b, capB);
      gl.uniform1f(u.capR, CAP_R * S * dpr);
      gl.uniform1f(u.nw, nW);
      gl.uniform1f(u.heroMix, clamp01(ez * 3));
      gl.uniform1f(u.dark, html.dataset.theme === "dark" ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      const hint = clamp01((t - LIQUID_END + 0.3) / 0.5);
      if (textRef.current) textRef.current.style.opacity = String(hint * Math.max(0, 1 - p * 4));
      if (skipRef.current) skipRef.current.style.opacity = String(Math.max(0, 1 - p * 3));
      if (rootRef.current) rootRef.current.style.opacity = done ? String(Math.max(0, 1 - (p - 0.88) * 9)) : "1";
      html.style.setProperty("--intro-p", String(ez));
    };

    const onResize = () => setup();
    window.addEventListener("resize", onResize);
    let cancelled = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return;
      setup();
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      detach();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onLost);
      html.style.overflow = "";
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: GATE }} />
      <div ref={rootRef} className="intro-cover fixed inset-0 z-[60] bg-bg">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
        <div ref={textRef} className="pointer-events-none absolute inset-x-0 bottom-[7vh] flex flex-col items-center gap-3 text-center" style={{ opacity: 0 }}>
          <span className="text-[0.95rem] font-medium tracking-tight">Ghifari Nafhan</span>
          <span className="flex items-center gap-2 text-[0.85rem] text-ink-3">
            <span className="intro-hint inline-block">↓</span> Scroll to open
          </span>
        </div>
        <button
          ref={skipRef}
          type="button"
          onClick={() => finish.current()}
          className="lg absolute right-5 top-5 rounded-full px-4 py-1.5 text-[0.85rem] text-ink-2 hover:text-ink"
        >
          Skip intro
        </button>
      </div>
    </>
  );
}
