"use client";

import { useEffect, useRef } from "react";
import { rasterize } from "./rasterize";

/*
 * A real refractive glass lens over the hero, drawn with a tiny WebGL shader (no three.js).
 * The hero is redrawn once into a texture (see rasterize.ts); the shader bends, magnifies and splits that
 * texture inside the lens, adds a rim, a highlight and a soft shadow. Outside the lens the
 * canvas is transparent, so the real page shows through and stays fully readable/selectable.
 *
 * Intro (once per session): a drop falls in, bounces, morphs into a glass "N" (three rounded
 * strokes like the logo), then turns back into a lens that follows the cursor. On touch
 * devices it floats on its own. Skipped for prefers-reduced-motion or without WebGL.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;     // canvas size in device px
uniform vec2 uC;       // lens centre (device px, y down)
uniform float uR;      // lens radius (device px)
uniform float uMorph;  // 0 = round lens, 1 = glass "N"
uniform float uAlpha;
uniform float uDark;
varying vec2 vUv;

float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float sdf(vec2 p) {
  float circle = length(p) - uR;
  vec2 q = p / uR;
  float r = 0.15;
  float n = sdCapsule(q, vec2(-0.62, 0.62), vec2(-0.32, -0.62), r);
  n = smin(n, sdCapsule(q, vec2(-0.32, -0.62), vec2(0.32, 0.62), r), 0.05);
  n = smin(n, sdCapsule(q, vec2(0.32, 0.62), vec2(0.62, -0.62), r), 0.05);
  return mix(circle, n * uR, uMorph);
}

void main() {
  vec2 px = vec2(vUv.x * uRes.x, (1.0 - vUv.y) * uRes.y);
  vec2 p = px - uC;
  float d = sdf(p);

  // soft drop shadow below the glass
  float ds = sdf(p - vec2(0.0, uR * 0.12));
  float shadow = (1.0 - smoothstep(0.0, uR * 0.35, ds)) * (uDark > 0.5 ? 0.35 : 0.14);

  if (d > 1.5) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, shadow * uAlpha);
    return;
  }

  float e = 1.5;
  vec2 n = normalize(vec2(sdf(p + vec2(e, 0.0)) - sdf(p - vec2(e, 0.0)),
                          sdf(p + vec2(0.0, e)) - sdf(p - vec2(0.0, e))) + 1e-6);
  float bevelW = uR * mix(0.55, 0.22, uMorph);
  float bevel = 1.0 - clamp(-d / bevelW, 0.0, 1.0);   // 1 at the edge, 0 in the flat middle

  // refraction: magnify the middle, bend strongly near the rim, split colours slightly
  vec2 bend = -n * pow(bevel, 2.2) * uR * 0.45;
  vec2 sp = uC + p * 0.78 + bend;
  vec2 ca = n * pow(bevel, 2.0) * uR * 0.014;
  float rr = texture2D(uTex, (sp + ca) / uRes).r;
  float gg = texture2D(uTex, sp / uRes).g;
  float bb = texture2D(uTex, (sp - ca) / uRes).b;
  vec3 col = vec3(rr, gg, bb);

  // glass body, rim and highlight
  vec3 tint = uDark > 0.5 ? vec3(1.0) : vec3(1.0);
  col = mix(col, tint, uDark > 0.5 ? 0.05 : 0.08);
  col += pow(bevel, 4.0) * (uDark > 0.5 ? 0.28 : 0.35);
  float spec = pow(max(dot(n, normalize(vec2(-0.55, -0.85))), 0.0), 5.0) * pow(bevel, 1.4);
  col += spec * 0.55;
  col -= pow(max(dot(n, normalize(vec2(0.5, 0.85))), 0.0), 4.0) * pow(bevel, 2.0) * 0.12;

  float a = (1.0 - smoothstep(-1.0, 1.5, d)) * uAlpha;
  float outA = max(a, shadow * uAlpha * (1.0 - a));
  gl_FragColor = vec4(col * a, outA);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

const easeOutBounce = (t: number) => {
  const n = 7.5625, d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
};
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export function GlassLens() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true });
    if (!gl) return;

    let disposed = false;
    let raf = 0;
    let shown = false;
    const hide = () => {
      canvas.style.visibility = "hidden";
    };
    canvas.addEventListener("webglcontextlost", hide);
    let ready = false;
    let visible = true;

    // --- GL setup
    const prog = gl.createProgram()!;
    try {
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    } catch {
      return;
    }
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u("uRes"), uC = u("uC"), uR = u("uR"), uMorph = u("uMorph"), uAlpha = u("uAlpha"), uDark = u("uDark");
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // --- sizing + snapshot of the hero
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = section.clientWidth;
      H = section.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const isDark = () => document.documentElement.dataset.theme === "dark";

    let snapping = false;
    const snapshot = async () => {
      if (snapping || disposed) return;
      snapping = true;
      try {
        await document.fonts?.ready;
        const shot = rasterize(section, dpr, canvas);
        if (disposed) return;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, shot);
        ready = true;
      } catch {
        // snapshot failed (e.g. a cross-origin image): leave the page as it is
      } finally {
        snapping = false;
      }
    };

    // --- motion state
    const seen = (() => {
      try {
        return sessionStorage.getItem("lens-intro") === "1";
      } catch {
        return false;
      }
    })();
    const hasHover = window.matchMedia("(hover: hover)").matches;
    const home = () => ({ x: W * (W > 768 ? 0.34 : 0.5), y: H * (W > 768 ? 0.45 : 0.62) });
    let cx = 0, cy = 0, r = 0, morph = 0, alpha = 0;
    let mx: number | null = null, my = 0;
    let t0 = 0;
    const INTRO = seen ? 0 : 3.7;

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const onLeave = () => {
      mx = null;
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!ready || !visible) return;
      if (!t0) t0 = now;
      const t = (now - t0) / 1000;
      const h = home();
      const baseR = Math.max(46, Math.min(78, W * 0.07));

      if (t < INTRO) {
        // 0–1.0s fall + bounce, 1.0–1.5 morph to N, 1.5–3.1 hold, 3.1–3.7 back to a lens
        const fall = easeOutBounce(clamp01(t / 1.0));
        cx = h.x;
        cy = -baseR * 1.5 + (h.y + baseR * 1.5) * fall;
        const toN = ease(clamp01((t - 1.0) / 0.5));
        const back = ease(clamp01((t - 3.1) / 0.6));
        morph = toN * (1 - back);
        r = baseR * (1 + 0.75 * morph);
        alpha = clamp01(t / 0.15);
      } else {
        if (!seen) {
          try {
            sessionStorage.setItem("lens-intro", "1");
          } catch {}
        }
        const tt = t - INTRO;
        let tx: number, ty: number;
        if (mx !== null && hasHover) {
          tx = mx;
          ty = my;
        } else {
          // idle float around the headline
          tx = h.x + Math.sin(tt * 0.45) * W * 0.12;
          ty = h.y + Math.sin(tt * 0.7) * H * 0.08;
        }
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        r += (baseR - r) * 0.1;
        morph += (0 - morph) * 0.1;
        alpha = Math.min(1, alpha + 0.08);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uC, cx * dpr, cy * dpr);
      gl.uniform1f(uR, r * dpr);
      gl.uniform1f(uMorph, morph);
      gl.uniform1f(uAlpha, alpha);
      gl.uniform1f(uDark, isDark() ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!shown) {
        if (gl.isContextLost() || gl.getError() !== gl.NO_ERROR) {
          cancelAnimationFrame(raf);
          hide();
          return;
        }
        shown = true;
        canvas.style.visibility = "visible";
      }
    };

    // pause when the hero is off screen
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
    });
    io.observe(section);

    // re-snapshot on theme change and resize
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        snapshot();
      }, 250);
    });
    ro.observe(section);
    const mo = new MutationObserver(() => setTimeout(snapshot, 120));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // start after the page has painted and gone idle
    resize();
    const start = () => {
      snapshot().then(() => {
        if (!disposed) raf = requestAnimationFrame(frame);
      });
    };
    // Rasterising the hero is the expensive part, so wait until the page has fully loaded,
    // settled, and the main thread is idle: it must never compete with first interactions.
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const later = () => setTimeout(() => (ric ? ric(start, { timeout: 1500 }) : start()), 300);
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      clearTimeout(resizeTimer);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("load", later);
      canvas.removeEventListener("webglcontextlost", hide);
      // Free GPU objects but keep the context: React may re-run this effect on the same canvas.
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full" style={{ visibility: "hidden" }} aria-hidden />;
}
