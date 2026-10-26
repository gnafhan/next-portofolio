/**
 * Cheap rasteriser for the glass lens: redraws a section's text, images and glass cards
 * onto a 2D canvas from their live layout boxes. A few milliseconds, no DOM cloning.
 */
export function rasterize(section: HTMLElement, dpr: number, skip: Element): HTMLCanvasElement {
  const box = section.getBoundingClientRect();
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(box.width * dpr);
  canvas.height = Math.round(box.height * dpr);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  const root = getComputedStyle(document.documentElement);
  ctx.fillStyle = root.getPropertyValue("--bg").trim() || "#fff";
  ctx.fillRect(0, 0, box.width, box.height);

  const rel = (r: DOMRect) => ({ x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height });

  // glass cards and chips: a soft rounded panel
  section.querySelectorAll<HTMLElement>(".glass, .lg, .lg-sm, .lg-accent, .btn-primary").forEach((el) => {
    if (skip.contains(el)) return;
    const s = getComputedStyle(el);
    const r = rel(el.getBoundingClientRect());
    if (!r.w || !r.h) return;
    const radius = Math.min(parseFloat(s.borderTopLeftRadius) || 0, r.h / 2);
    ctx.beginPath();
    ctx.roundRect(r.x, r.y, r.w, r.h, radius);
    ctx.fillStyle = s.backgroundColor;
    ctx.fill();
    ctx.strokeStyle = s.borderTopColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // images (the portrait)
  section.querySelectorAll("img").forEach((img) => {
    if (!img.complete || !img.naturalWidth) return;
    const r = rel(img.getBoundingClientRect());
    try {
      ctx.drawImage(img, r.x, r.y, r.w, r.h);
    } catch {}
  });

  // text, word by word, at its real position
  const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || skip.contains(parent)) continue;
    const text = node.textContent ?? "";
    if (!text.trim()) continue;
    const s = getComputedStyle(parent);
    if (s.visibility === "hidden" || s.opacity === "0") continue;
    ctx.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    ctx.fillStyle = s.color;
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = s.letterSpacing === "normal" ? "0px" : s.letterSpacing;
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const rects = range.getClientRects();
      if (!rects.length) continue;
      const r = rel(rects[0]);
      ctx.fillText(m[0], r.x, r.y + r.h / 2);
    }
  }
  return canvas;
}
