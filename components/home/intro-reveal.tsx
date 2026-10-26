"use client";

import { useEffect, useRef } from "react";
import { buildLogoTextures, SDF } from "./logo-sdf";

/*
 * Full-screen liquid-glass intro (WebGL, no libraries).
 *
 * Separate drops of liquid glass float over a living halftone backdrop (a slow wave of light
 * sweeps the dots, a few twinkle in the logo colours). Scrolling pulls the drops together: they
 * melt into one glass "N" (the real logo, drawn from a signed distance field so it stays smooth).
 * The N's pane is a clear window onto the live page underneath (the canvas is transparent there),
 * and scrolling on zooms through it until the page is all that's left.
 *
 * An inline script decides before first paint whether to show it (WebGL on a real GPU, no
 * reduced motion, once per tab session; ?intro forces it), so there is no flash of content.
 */

// Skipped without a real GPU (software renderers like SwiftShader would make it stutter).
const GATE = `(function(){try{var d=document.documentElement,force=/[?&]intro\\b/.test(location.search),why=function(r){console.info('[intro] skipped: '+r+' (add ?intro to the URL to force it)');};if(!force&&matchMedia('(prefers-reduced-motion: reduce)').matches)return why('reduced motion is on in system settings');if(!force&&sessionStorage.getItem('intro-seen'))return why('already shown in this tab');var g=document.createElement('canvas').getContext('webgl');if(!g)return why('WebGL unavailable');var i=g.getExtension('WEBGL_debug_renderer_info');var r=i?String(g.getParameter(i.UNMASKED_RENDERER_WEBGL)):'';if(!force&&/swiftshader|llvmpipe|software/i.test(r))return why('software renderer: '+r);d.dataset.intro='on';}catch(e){console.info('[intro] skipped: '+e);}})();`;

const LOGO_H = 290;
const CENTER = { x: 228, y: 249 };
const FOCUS = { x: 232, y: 240 }; // inside the diagonal stroke: zooming here fills the screen with glass
// where blobs settle on the way into the N (approximate stroke centre lines, logo units)
const STROKES: [number, number, number, number][] = [
  [100, 335, 182, 145],
  [168, 135, 296, 345],
  [288, 340, 362, 150],
];
const ZOOM = 70;
const BLOBS = 10;

const VERT = `attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }`;

const FRAG = `
precision highp float;
uniform sampler2D uSdf;    // logo signed distance (R)
uniform sampler2D uLogoCol;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform vec3 uBlob[${BLOBS}];
uniform float uBlend;      // how readily blobs melt together (grows while merging)
uniform vec2 uC;           // screen centre (device px)
uniform float uS;          // device px per logo unit
uniform vec2 uAnchor;      // logo point placed at the screen centre
uniform vec4 uSdfMap;      // k, pad, texW, texH
uniform float uSdfRange;
uniform float uNW;         // logo presence 0..1
uniform float uLive;      // 0 = the glass refracts the backdrop, 1 = its pane shows the live page
uniform float uClear;     // fades the stained-glass tint while zooming through
uniform float uOut;       // the backdrop outside the glass dissolves (only at the very end)
uniform vec3 uBgCol;
uniform vec3 uDotCol;
uniform float uDark;
varying vec2 vUv;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec2 logoUv(vec2 px) {
  vec2 l = (px - uC) / uS + uAnchor;                 // logo units
  vec2 t = (l - vec2(58.0, 104.0)) * uSdfMap.x + uSdfMap.y;
  return t / uSdfMap.zw;
}
float logoDist(vec2 px) {
  vec2 uv = logoUv(px);
  float sd;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) sd = uSdfRange;
  else sd = (texture2D(uSdf, uv).r * 2.0 - 1.0) * uSdfRange;
  return sd / uSdfMap.x * uS + (1.0 - uNW) * 900.0 * uDpr;   // canvas px -> logo units -> device px
}
float scene(vec2 p) {
  float d = 1e5;
  for (int i = 0; i < ${BLOBS}; i++) {
    vec3 b = uBlob[i];
    if (b.z > 0.5) d = smin(d, length(p - b.xy) - b.z, uBlend);
  }
  return smin(d, logoDist(p), uBlend * (1.0 - uNW) + 0.5);
}

// living halftone: a slow wave of light sweeps across the dots, a few twinkle in the logo colours
vec3 backdrop(vec2 px) {
  float g = 24.0 * uDpr;
  vec2 cell = floor(px / g);
  vec2 f = (fract(px / g) - 0.5) * g;
  vec2 cc = (cell + 0.5) * g / uRes;
  float h = hash(cell);
  float wave = 0.5 + 0.5 * sin((cc.x * 1.3 + cc.y * 0.8) * 7.0 - uTime * 0.9);
  float pulse = 0.5 + 0.5 * sin(length(cc - 0.5) * 11.0 - uTime * 1.4);
  float glow = pow(wave, 3.0) * 0.7 + pow(pulse, 6.0) * 0.4;
  float tw = pow(0.5 + 0.5 * sin(uTime * (0.8 + h * 1.7) + h * 60.0), 18.0);
  float r = (1.0 + glow * 0.9 + tw * 1.2) * uDpr;
  float dotMask = 1.0 - smoothstep(r - 0.6 * uDpr, r + 0.6 * uDpr, length(f));
  vec3 col = uDotCol * (0.35 + glow * 0.65);
  if (h > 0.94) {
    float k = hash(cell + 7.0);
    vec3 brand = k < 0.33 ? vec3(0.33, 0.49, 0.75) : (k < 0.66 ? vec3(0.91, 0.27, 0.21) : vec3(0.97, 0.73, 0.09));
    col = mix(col, brand, 0.85);
    dotMask *= 0.6 + tw * 0.8;
  }
  return mix(uBgCol, col, clamp(dotMask, 0.0, 1.0));
}

void main() {
  vec2 px = vec2(vUv.x * uRes.x, (1.0 - vUv.y) * uRes.y);
  float d = scene(px);
  float sh = (1.0 - smoothstep(0.0, 30.0 * uDpr, d)) * (uDark > 0.5 ? 0.38 : 0.08);
  // outside the glass: the living backdrop, dissolving at the very end so the page is all that's left
  vec4 outside = vec4(backdrop(px) * (1.0 - sh), 1.0) * (1.0 - uOut);
  if (d > max(1.5, uS / uSdfMap.x * 0.6)) { gl_FragColor = outside; return; }

  float e = 1.5 * uDpr;
  vec2 g = vec2(scene(px + vec2(e, 0.0)) - scene(px - vec2(e, 0.0)),
                scene(px + vec2(0.0, e)) - scene(px - vec2(0.0, e)));
  // flat middle of a wide stroke has no gradient: keep the normal finite there
  vec2 n = dot(g, g) > 1e-4 ? normalize(g) : vec2(0.0);
  // drops are thick glass; the N becomes a flat stained-glass pane with a thin bright rim
  float bevelW = mix(34.0, 7.0, uNW) * uDpr;
  float bevel = 1.0 - clamp(-d / bevelW, 0.0, 1.0);

  // refraction of the backdrop (drops, and the bevelled rim of the N)
  vec2 sp = px - n * pow(bevel, 1.3) * 58.0 * uDpr - n * (1.0 - bevel) * 10.0 * uDpr;
  float fr = 0.9 * uDpr;
  vec3 c = backdrop(sp) * 0.4
         + backdrop(sp + vec2(fr, 0.0)) * 0.15 + backdrop(sp - vec2(fr, 0.0)) * 0.15
         + backdrop(sp + vec2(0.0, fr)) * 0.15 + backdrop(sp - vec2(0.0, fr)) * 0.15;
  vec2 ca = n * pow(bevel, 2.0) * 4.0 * uDpr;
  c.r = mix(c.r, backdrop(sp + ca).r, 0.7);
  c.b = mix(c.b, backdrop(sp - ca).b, 0.7);
  c = mix(c, vec3(1.0), uDark > 0.5 ? 0.05 : 0.03);
  c -= pow(bevel, 2.5) * (uDark > 0.5 ? 0.04 : 0.11);

  // once the N has formed its pane is a clear window onto the live page; only the rim stays solid
  float body = mix(1.0, smoothstep(0.15, 1.0, bevel), uLive);
  vec4 col = vec4(c * body, body);

  // stained-glass tint in the logo's own colours, laid over whatever shows through
  vec4 lc = texture2D(uLogoCol, clamp(logoUv(px), 0.0, 1.0));
  float ta = 0.24 * lc.a * uNW * (1.0 - uClear);
  col = vec4(lc.rgb * ta, ta) + col * (1.0 - ta);

  // highlights: bright rim, top-left specular, soft shade on the far side
  float hl = clamp(pow(bevel, 9.0) * (uDark > 0.5 ? 0.45 : 0.35)
           + pow(max(dot(n, normalize(vec2(-0.55, -0.85))), 0.0), 10.0) * pow(bevel, 1.5) * 0.75, 0.0, 1.0);
  col = vec4(vec3(hl), hl) + col * (1.0 - hl);
  float shade = pow(max(dot(n, normalize(vec2(0.55, 0.85))), 0.0), 3.0) * pow(bevel, 2.0) * 0.12;
  col = vec4(0.0, 0.0, 0.0, shade) + col * (1.0 - shade);

  // edge anti-aliasing widens with the zoom so magnified edges stay soft instead of jagged
  float aa = max(1.5, uS / uSdfMap.x * 0.6);
  float a = 1.0 - smoothstep(-aa, aa, d);
  gl_FragColor = mix(outside, col, a);
}
`;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function cssColor(name: string, fallback: string): [number, number, number] {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.fillStyle = fallback;
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
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
    function detach() {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    }
    const release = () => {
      if (released) return;
      released = true;
      detach();
      cancelAnimationFrame(raf);
      html.style.overflow = "";
      html.style.removeProperty("--intro-p");
      delete html.dataset.intro;
    };

    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!gl) {
      release();
      return;
    }
    const onLost = () => {
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
      release();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    // --- program
    const compile = (type: number, text: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, text);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.info("[intro] skipped: shader failed", gl.getProgramInfoLog(prog));
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
      res: U("uRes"), dpr: U("uDpr"), time: U("uTime"), blob: U("uBlob"), blend: U("uBlend"), c: U("uC"), s: U("uS"),
      anchor: U("uAnchor"), sdfMap: U("uSdfMap"), sdfRange: U("uSdfRange"), nw: U("uNW"), live: U("uLive"), clear: U("uClear"), out: U("uOut"),
      bgCol: U("uBgCol"), dotCol: U("uDotCol"), dark: U("uDark"), sdf: U("uSdf"), logoCol: U("uLogoCol"),
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
    const logo = buildLogoTextures();
    // float distance field when the GPU can filter it (smooth at any zoom), else the 8-bit one
    const canFloat = !!gl.getExtension("OES_texture_float") && !!gl.getExtension("OES_texture_float_linear");
    let sdfTex: WebGLTexture | null;
    if (canFloat) {
      sdfTex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sdfTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SDF.w, SDF.h, 0, gl.RGBA, gl.FLOAT, logo.floats);
    } else {
      sdfTex = makeTex(0, logo.sdf);
    }
    const colTex = makeTex(1, logo.color);
    gl.uniform1i(u.sdf, 0);
    gl.uniform1i(u.logoCol, 1);
    gl.uniform4f(u.sdfMap, SDF.k, SDF.pad, SDF.w, SDF.h);
    gl.uniform1f(u.sdfRange, SDF.range);

    let W = 0, H = 0, dpr = 1;
    const setup = () => {
      // full-screen shader: render at <=1x (0.75x on phones) and let CSS upscale
      dpr = Math.min(window.devicePixelRatio || 1, 1) * (window.innerWidth < 768 ? 0.75 : 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const bg = cssColor("--bg", "#18181b");
      const dot = cssColor("--ink-3", "#9a9aa4");
      gl.uniform3f(u.bgCol, bg[0], bg[1], bg[2]);
      gl.uniform3f(u.dotCol, dot[0], dot[1], dot[2]);
    };

    // --- blobs: separate drops of glass spread over the whole screen
    const seeds = Array.from({ length: BLOBS }, (_, i) => ({
      gx: ((i * 0.618034) % 1) * 0.86 + 0.07,
      gy: ((i * 0.381966 + 0.21) % 1) * 0.72 + 0.14,
      size: 0.045 + ((i * 7) % 5) * 0.016,
      ph: i * 1.7,
      w1: 0.22 + (i % 3) * 0.09,
      w2: 0.18 + (i % 4) * 0.07,
      stroke: i % 3,
      along: ((i * 0.37) % 1) * 0.8 + 0.1,
    }));

    // --- scroll drives everything: 0..0.45 the drops flow together into the N, 0.45..1 zoom through it
    let target = 0;
    let p = 0;
    let done = false;
    let touchY: number | null = null;
    const t0 = performance.now();

    const end = () => {
      if (done) return;
      done = true;
      target = 1;
      detach();
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
      setTimeout(release, 800);
    };
    finish.current = end;

    const push = (delta: number) => {
      target = clamp01(target + delta);
      if (target >= 0.93) end();
    };
    function onWheel(e: WheelEvent) {
      if (done) return;
      e.preventDefault();
      push(e.deltaY / 2000);
    }
    function onTouchStart(e: TouchEvent) {
      touchY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      if (done || touchY === null) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      push((touchY - y) / 900);
      touchY = y;
    }
    function onKey(e: KeyboardEvent) {
      if (done) return;
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        push(0.2);
      }
      if (e.key === "Escape") end();
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    const blobData = new Float32Array(BLOBS * 3);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const t = (performance.now() - t0) / 1000;
      p += (target - p) * 0.1;
      if (done && p > 0.998) p = 1;

      const merge = easeInOut(clamp01(p / 0.45));
      const zoom = easeInOut(clamp01((p - 0.45) / 0.55));
      const minWH = Math.min(W, H);
      const S = ((minWH * 0.46) / LOGO_H) * Math.exp(Math.log(ZOOM) * zoom);
      const ax = CENTER.x + (FOCUS.x - CENTER.x) * Math.min(1, zoom * 2);
      const ay = CENTER.y + (FOCUS.y - CENTER.y) * Math.min(1, zoom * 2);
      const toScreen = (lx: number, ly: number) => [W / 2 + (lx - ax) * S, H / 2 + (ly - ay) * S];

      const nW = smooth(0.55, 1, merge);
      const vanish = smooth(0.7, 1, merge);
      seeds.forEach((sd, i) => {
        const pop = easeOut(clamp01((t - i * 0.08) / 0.7));
        const fx = sd.gx * W + Math.sin(t * sd.w1 + sd.ph) * minWH * 0.06;
        const fy = sd.gy * H + Math.cos(t * sd.w2 + sd.ph) * minWH * 0.06;
        const [x1, y1, x2, y2] = STROKES[sd.stroke];
        const [tx, ty] = toScreen(x1 + (x2 - x1) * sd.along, y1 + (y2 - y1) * sd.along);
        const x = fx + (tx - fx) * merge;
        const y = fy + (ty - fy) * merge;
        const rFloat = sd.size * minWH * (1 + 0.1 * Math.sin(t * 1.1 + sd.ph));
        const r = (rFloat + (26 * S - rFloat) * merge) * pop * (1 - vanish);
        blobData[i * 3] = x * dpr;
        blobData[i * 3 + 1] = y * dpr;
        blobData[i * 3 + 2] = r * dpr;
      });

      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.dpr, dpr);
      gl.uniform1f(u.time, t);
      gl.uniform3fv(u.blob, blobData);
      // drops barely touch while floating, and melt into each other as they merge
      gl.uniform1f(u.blend, (14 + 70 * merge) * dpr);
      gl.uniform2f(u.c, (W / 2) * dpr, (H / 2) * dpr);
      gl.uniform1f(u.s, S * dpr);
      gl.uniform2f(u.anchor, ax, ay);
      gl.uniform1f(u.nw, nW);
      gl.uniform1f(u.live, smooth(0.6, 1, nW));
      gl.uniform1f(u.clear, clamp01(zoom * 2.5));
      gl.uniform1f(u.out, smooth(0.75, 1, zoom));
      gl.uniform1f(u.dark, html.dataset.theme === "dark" ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      // the canvas now paints the backdrop itself; drop the cover's solid fill so the glass can see the page
      if (rootRef.current && !rootRef.current.style.background) rootRef.current.style.background = "transparent";

      const hint = clamp01((t - 1.2) / 0.6);
      if (textRef.current) textRef.current.style.opacity = String(hint * Math.max(0, 1 - p * 5));
      if (skipRef.current) skipRef.current.style.opacity = String(Math.max(0, 1 - p * 3));
      if (rootRef.current) rootRef.current.style.opacity = done ? String(Math.max(0, 1 - (p - 0.9) * 10)) : "1";
      html.style.setProperty("--intro-p", String(zoom));
    };

    const onResize = () => setup();
    window.addEventListener("resize", onResize);
    let cancelled = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return;
      setup();
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      detach();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onLost);
      html.style.overflow = "";
      gl.deleteTexture(sdfTex);
      gl.deleteTexture(colTex);
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
            <span className="intro-hint inline-block">↓</span> Scroll to bring it together
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
