/* Simulated perception feed for the hero: a road in perspective, vehicles with
   detection boxes, confidence scores and a time-to-collision readout.
   Purely illustrative; nothing here is real data. */
(function () {
  const canvas = document.getElementById("scene");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, dpr = 1, horizon = 0, colors = {};
  const mouse = { x: 0.5, y: 0.5, inside: false };
  const LANES = [-1, 0, 1];
  const LABELS = ["car", "car", "car", "truck", "van"];
  let cars = [];
  let roadOffset = 0;
  let last = performance.now();
  let visible = true;

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    colors = {
      accent: cs.getPropertyValue("--accent").trim(),
      accent2: cs.getPropertyValue("--accent-2").trim(),
      warn: cs.getPropertyValue("--warn").trim(),
      line: cs.getPropertyValue("--line").trim(),
      surface: cs.getPropertyValue("--surface").trim(),
      surface2: cs.getPropertyValue("--surface-2").trim(),
      text: cs.getPropertyValue("--text").trim(),
      bg: cs.getPropertyValue("--bg").trim(),
    };
  }
  window.__sceneRefresh = readColors;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    horizon = H * 0.42;
  }

  function spawn(initial) {
    const lane = LANES[(Math.random() * LANES.length) | 0];
    const closing = Math.random() < 0.8;
    cars.push({
      lane,
      d: initial ? 2 + Math.random() * 10 : closing ? 12 : 1.6,
      v: closing ? 0.2 + Math.random() * 0.55 : -(0.15 + Math.random() * 0.4), // closing speed
      label: LABELS[(Math.random() * LABELS.length) | 0],
      conf: 0.86 + Math.random() * 0.13,
      id: 1 + ((Math.random() * 90) | 0),
      hue: Math.random(),
    });
  }

  // d = distance in "units"; s = perspective scale (1 at the bottom of the frame)
  const scale = (d) => 1 / d;
  const roadHalf = () => Math.min(W * 0.34, 520);
  const project = (lane, d) => {
    const s = scale(d);
    const sx = (mouse.x - 0.5) * 36;
    return {
      x: W * 0.68 + sx * s + lane * roadHalf() * 0.62 * s,
      y: horizon + (H - horizon) * 0.98 * s,
      s,
    };
  };

  function drawRoad(t) {
    const cx = W * 0.68 + (mouse.x - 0.5) * 6;
    const half = roadHalf();
    // asphalt
    ctx.save();
    const g = ctx.createLinearGradient(0, horizon, 0, H);
    g.addColorStop(0, "transparent");
    g.addColorStop(1, colors.surface2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx - 6, horizon);
    ctx.lineTo(cx + 6, horizon);
    ctx.lineTo(cx + half * 1.1 + W * 0.25, H);
    ctx.lineTo(cx - half * 1.1 - W * 0.25, H);
    ctx.fill();
    // horizon line
    ctx.strokeStyle = colors.line;
    ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.moveTo(0, horizon); ctx.lineTo(W, horizon); ctx.stroke();
    ctx.globalAlpha = 1;
    // lane dashes (two separators at +-0.31 lanes, drawn as moving dashes)
    // solid road edges
    ctx.strokeStyle = colors.accent2;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    for (const edge of [-1.5, 1.5]) {
      const a = project(edge, 0.9), b = project(edge, 40);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.text;
    for (const edge of [-0.5, 0.5]) {
      for (let k = 0; k < 18; k++) {
        const dd1 = 0.9 + Math.pow(k + 1 - (roadOffset % 1), 1.45);
        const dd2 = dd1 + 0.28 * Math.pow(Math.max(dd1, 1), 0.55);
        if (dd1 > 40) continue;
        const a = project(edge, dd1), b = project(edge, dd2);
        ctx.globalAlpha = Math.min(0.8, 0.15 + a.s * 2);
        ctx.lineWidth = Math.max(1, 7 * a.s);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function corners(x, y, w, h, c, len) {
    ctx.beginPath();
    ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
    ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len);
    ctx.moveTo(x + w, y + h - len); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - len, y + h);
    ctx.moveTo(x + len, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - len);
    ctx.strokeStyle = c; ctx.stroke();
  }

  function drawCar(c) {
    const p = project(c.lane, c.d);
    const w = 270 * p.s * (c.label === "truck" ? 1.25 : 1);
    const h = (c.label === "truck" ? 215 : 150) * p.s;
    if (w < 8) return;
    const x = p.x - w / 2, y = p.y - h;
    const ego = c.lane === 0 && c.v > 0;
    const col = ego && c.d < 4 ? colors.warn : colors.accent;

    // body silhouette
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = colors.bg;
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    roundRect(x, y + h * 0.18, w, h * 0.82, w * 0.06);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = colors.surface;
    roundRect(x + w * 0.14, y, w * 0.72, h * 0.42, w * 0.05);
    ctx.fill(); ctx.stroke();
    // tail lights
    ctx.fillStyle = "#ff4d4d";
    ctx.fillRect(x + w * 0.06, y + h * 0.62, w * 0.14, h * 0.1);
    ctx.fillRect(x + w * 0.8, y + h * 0.62, w * 0.14, h * 0.1);
    ctx.globalAlpha = 1;

    // detection box
    const pad = 6 * Math.max(p.s, 0.25) + 3;
    ctx.lineWidth = Math.max(1.5, 2.2 * Math.min(p.s * 2, 1));
    corners(x - pad, y - pad, w + pad * 2, h + pad * 2, col, Math.min(w, h) * 0.28);

    // label
    if (w > 28 && c.showLabel) {
      const fs = Math.max(9, Math.min(13, 13 * Math.min(p.s * 2.2, 1)));
      ctx.font = `${fs}px "JetBrains Mono", monospace`;
      const dist = (c.d * 8).toFixed(1);
      let text = `${c.label} ${c.conf.toFixed(2)}`;
      const sub = ego && c.v > 0.05 ? `id${c.id} · ${dist}m · TTC ${(c.d / c.v).toFixed(1)}s` : `id${c.id} · ${dist}m`;
      const tw = Math.max(ctx.measureText(text).width, ctx.measureText(sub).width) + 12;
      const ty = y - pad - fs * 2.6;
      ctx.fillStyle = col;
      ctx.fillRect(x - pad, ty, tw, fs * 2.5);
      ctx.fillStyle = colors.bg;
      ctx.textBaseline = "top";
      ctx.fillText(text, x - pad + 6, ty + 3);
      ctx.fillText(sub, x - pad + 6, ty + 3 + fs + 1);
    }
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawCursor(t) {
    if (!mouse.inside) return;
    const x = mouse.x * W, y = mouse.y * H, s = 36 + Math.sin(t / 300) * 3;
    ctx.lineWidth = 1.5;
    corners(x - s, y - s, s * 2, s * 2, colors.accent2, 10);
    ctx.font = '11px "JetBrains Mono", monospace';
    const label = "visitor 1.00";
    const tw = ctx.measureText(label).width + 10;
    ctx.fillStyle = colors.accent2;
    ctx.fillRect(x - s, y - s - 18, tw, 16);
    ctx.fillStyle = colors.bg;
    ctx.textBaseline = "top";
    ctx.fillText(label, x - s + 5, y - s - 15);
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!reduceMotion) {
      roadOffset += dt * 1.1;
      for (const c of cars) c.d -= c.v * dt;
      cars = cars.filter((c) => c.d > 0.95 && c.d < 14);
      while (cars.length < 5) spawn(false);
    }
    ctx.clearRect(0, 0, W, H);
    drawRoad(now);
    // far to near so near cars overlap far ones
    const sorted = [...cars].sort((a, b) => b.d - a.d);
    sorted.forEach((c, i) => { c.showLabel = i >= sorted.length - 3; drawCar(c); });
    drawCursor(now);
  }

  readColors();
  resize();
  for (let i = 0; i < 5; i++) spawn(true);
  window.addEventListener("resize", resize);
  const hero = canvas.parentElement;
  hero.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width;
    mouse.y = (e.clientY - r.top) / r.height;
    mouse.inside = e.pointerType === "mouse";
  });
  hero.addEventListener("pointerleave", () => { mouse.inside = false; });
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(hero);
  requestAnimationFrame(frame);
})();
