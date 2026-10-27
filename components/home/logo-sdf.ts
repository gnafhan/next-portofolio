import { LOGO_PATHS } from "../icons";

/**
 * Signed distance field of the real logo, so the shader can draw a perfectly smooth glass "N"
 * (rounded strokes exactly like the mark) at any zoom. Built once on a small canvas with an
 * exact Euclidean distance transform (Felzenszwalb & Huttenlocher), a few milliseconds.
 */

export const SDF = { k: 1.25, pad: 40, w: 0, h: 0, range: 96 };
SDF.w = Math.ceil(340 * SDF.k + SDF.pad * 2);
SDF.h = Math.ceil(290 * SDF.k + SDF.pad * 2);

function edt1d(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

/** In-place 2D squared Euclidean distance transform of `grid` (0 = on a seed, values = squared offsets). */
function edt(grid: Float64Array, w: number, h: number) {
  const n = Math.max(w, h);
  const f = new Float64Array(n), d = new Float64Array(n), z = new Float64Array(n + 1);
  const v = new Int32Array(n);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y++) grid[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = grid[y * w + x];
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x++) grid[y * w + x] = d[x];
  }
}

function drawLogo(ctx: CanvasRenderingContext2D, colored: boolean) {
  ctx.setTransform(SDF.k, 0, 0, SDF.k, SDF.pad - 58 * SDF.k, SDF.pad - 104 * SDF.k);
  for (const p of LOGO_PATHS) {
    ctx.fillStyle = colored ? p.fill : "#000";
    ctx.fill(new Path2D(p.d));
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Returns the distance field as 8-bit canvas (fallback), as float data (preferred: no banding when
 * zoomed), and the colour texture.
 */
export function buildLogoTextures() {
  const { w, h, range } = SDF;
  const mask = document.createElement("canvas");
  mask.width = w;
  mask.height = h;
  const mctx = mask.getContext("2d", { willReadFrequently: true })!;
  drawLogo(mctx, false);
  const alpha = mctx.getImageData(0, 0, w, h).data;
  // seed with sub-pixel coverage from the anti-aliased edge (as in Mapbox tiny-sdf), so the
  // field has no pixel staircase even when the zoom magnifies it 70x
  const INF = 1e20;
  const outer = new Float64Array(w * h);
  const inner = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const a = alpha[i * 4 + 3] / 255;
    if (a >= 1) {
      outer[i] = 0;
      inner[i] = INF;
    } else if (a <= 0) {
      outer[i] = INF;
      inner[i] = 0;
    } else {
      const d = 0.5 - a;
      outer[i] = d > 0 ? d * d : 0;
      inner[i] = d < 0 ? d * d : 0;
    }
  }
  edt(outer, w, h);
  edt(inner, w, h);
  const toInside = outer;
  const toOutside = inner;

  const sdf = document.createElement("canvas");
  sdf.width = w;
  sdf.height = h;
  const sctx = sdf.getContext("2d")!;
  const img = sctx.createImageData(w, h);
  const floats = new Float32Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const sd = Math.sqrt(toInside[i]) - Math.sqrt(toOutside[i]); // >0 outside, <0 inside
    const n = Math.max(0, Math.min(1, (sd / range) * 0.5 + 0.5));
    const v = Math.round(n * 255);
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
    floats[i * 4] = n;
    floats[i * 4 + 3] = 1;
  }
  sctx.putImageData(img, 0, 0);

  const color = document.createElement("canvas");
  color.width = w;
  color.height = h;
  drawLogo(color.getContext("2d")!, true);
  return { sdf, floats, color };
}
