/* Interactive "vision model" hero. A procedural image (a few drifting shapes) is
   shown on a patch grid, and four modes visualise what a CV model does with it:
   detect (boxes + confidence), segment (class masks), attention (patch heatmap
   driven by the cursor) and conv (a 3x3 kernel sweeping out an edge feature map).
   Purely illustrative; nothing here is real model output. */
(function () {
  const canvas = document.getElementById("scene");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const MODES = {
    detect: "detection: boxes, class labels and confidence scores",
    segment: "segmentation: a class label for every pixel",
    attention: "attention: patch weights follow your cursor",
    conv: "convolution: a 3×3 kernel sweeps out an edge feature map",
  };
  let mode = "detect";

  let W = 0, H = 0, dpr = 1, CS = 22, cols = 0, rows = 0, colors = {};
  let trail = new Float32Array(0);
  const mouse = { x: 0, y: 0, inside: false };
  let visible = true, time = 0, last = performance.now(), kernelPos = 0;

  const SHAPES = [
    { type: "circle", cls: 0, label: "circle", r: 70, fx: 0.31, fy: 0.23, ph: 0.0, ax: 0.07, ay: 0.06, bx: 0.58, by: 0.34 },
    { type: "square", cls: 1, label: "square", r: 62, fx: 0.27, fy: 0.37, ph: 1.7, ax: 0.06, ay: 0.07, bx: 0.82, by: 0.52 },
    { type: "triangle", cls: 2, label: "triangle", r: 66, fx: 0.22, fy: 0.29, ph: 3.1, ax: 0.07, ay: 0.05, bx: 0.64, by: 0.72 },
    { type: "circle", cls: 0, label: "circle", r: 40, fx: 0.41, fy: 0.19, ph: 4.4, ax: 0.05, ay: 0.06, bx: 0.88, by: 0.22 },
    { type: "square", cls: 1, label: "square", r: 38, fx: 0.33, fy: 0.43, ph: 5.2, ax: 0.04, ay: 0.04, bx: 0.76, by: 0.84 },
  ];
  const clsColor = (i) => [colors.accent, colors.accent2, colors.warn][i];

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const g = (n) => cs.getPropertyValue(n).trim();
    colors = { accent: g("--accent"), accent2: g("--accent-2"), warn: g("--warn"), line: g("--line"),
      surface: g("--surface"), surface2: g("--surface-2"), text: g("--text"), bg: g("--bg"), muted: g("--muted") };
  }
  window.__sceneRefresh = readColors;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    CS = W < 700 ? 18 : 22;
    cols = Math.ceil(W / CS); rows = Math.ceil(H / CS);
    trail = new Float32Array(cols * rows);
    mouse.x = W * 0.66; mouse.y = H * 0.5;
  }

  // shape state at the current time, in pixels
  function place(s) {
    const narrow = W < 900;
    const bx = narrow ? 0.12 + s.bx * 0.78 : s.bx;
    const sc = narrow ? 0.7 : Math.min(W / 1440, 1.15);
    return {
      ...s,
      r: s.r * Math.max(sc, 0.6),
      x: (bx + s.ax * Math.sin(time * s.fx + s.ph)) * W,
      y: (s.by + s.ay * Math.cos(time * s.fy + s.ph)) * H,
    };
  }
  let placed = [];

  function inside(s, px, py) {
    const dx = px - s.x, dy = py - s.y;
    if (s.type === "circle") return dx * dx + dy * dy < s.r * s.r;
    if (s.type === "square") return Math.abs(dx) < s.r * 0.85 && Math.abs(dy) < s.r * 0.85;
    return dy > -s.r && dy < s.r && Math.abs(dx) <= (dy + s.r) / 2;
  }
  function classAt(px, py) {
    for (let i = placed.length - 1; i >= 0; i--) if (inside(placed[i], px, py)) return placed[i].cls + 1;
    return 0;
  }
  function bbox(s) {
    const k = s.type === "square" ? 0.85 : 1;
    return { x: s.x - s.r * k, y: s.y - s.r * k, w: s.r * 2 * k, h: s.r * 2 * k };
  }

  function path(s) {
    ctx.beginPath();
    if (s.type === "circle") ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    else if (s.type === "square") ctx.rect(s.x - s.r * 0.85, s.y - s.r * 0.85, s.r * 1.7, s.r * 1.7);
    else { ctx.moveTo(s.x, s.y - s.r); ctx.lineTo(s.x + s.r, s.y + s.r); ctx.lineTo(s.x - s.r, s.y + s.r); ctx.closePath(); }
  }

  function corners(x, y, w, h, c, len) {
    ctx.beginPath();
    ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
    ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len);
    ctx.moveTo(x + w, y + h - len); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - len, y + h);
    ctx.moveTo(x + len, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - len);
    ctx.strokeStyle = c; ctx.stroke();
  }
  function tag(text, x, y, bg, fg, fs) {
    ctx.font = `${fs}px "JetBrains Mono", monospace`;
    ctx.textBaseline = "top";
    const w = ctx.measureText(text).width + 10;
    ctx.fillStyle = bg; ctx.fillRect(x, y, w, fs + 8);
    ctx.fillStyle = fg; ctx.fillText(text, x + 5, y + 4);
  }

  function drawGrid(emphasis) {
    ctx.strokeStyle = colors.line;
    ctx.globalAlpha = emphasis ? 0.7 : 0.32;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let c = 0; c <= cols; c++) { ctx.moveTo(c * CS + 0.5, 0); ctx.lineTo(c * CS + 0.5, H); }
    for (let r = 0; r <= rows; r++) { ctx.moveTo(0, r * CS + 0.5); ctx.lineTo(W, r * CS + 0.5); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawShapesBase(fillAlpha) {
    placed.forEach((s) => {
      path(s);
      ctx.globalAlpha = fillAlpha;
      ctx.fillStyle = colors.surface2;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors.line; ctx.lineWidth = 1.5; ctx.stroke();
    });
  }

  /* ---- modes ---- */
  function drawDetect() {
    drawGrid(false);
    drawShapesBase(0.9);
    placed.forEach((s, i) => {
      const b = bbox(s), pad = 8, col = clsColor(s.cls);
      const conf = 0.9 + 0.08 * Math.sin(time * 1.3 + i * 2);
      ctx.lineWidth = 2;
      corners(b.x - pad, b.y - pad, b.w + pad * 2, b.h + pad * 2, col, Math.min(b.w, b.h) * 0.25);
      tag(`${s.label} ${conf.toFixed(2)}`, b.x - pad, b.y - pad - 20, col, colors.bg, 11);
    });
  }

  function drawSegment() {
    drawGrid(false);
    placed.forEach((s) => {
      path(s);
      ctx.globalAlpha = 0.55; ctx.fillStyle = clsColor(s.cls); ctx.fill();
      ctx.globalAlpha = 1; ctx.strokeStyle = clsColor(s.cls); ctx.lineWidth = 2; ctx.stroke();
    });
    // legend
    [["circle", 0], ["square", 1], ["triangle", 2]].forEach(([n, i], k) => {
      ctx.fillStyle = clsColor(i); ctx.globalAlpha = 0.9;
      ctx.fillRect(W - 120, H * 0.72 + k * 22, 12, 12); ctx.globalAlpha = 1;
      ctx.font = '11px "JetBrains Mono", monospace'; ctx.textBaseline = "top";
      ctx.fillStyle = colors.muted; ctx.fillText(`${i} · ${n}`, W - 102, H * 0.72 - 1 + k * 22);
    });
  }

  function drawAttention() {
    drawShapesBase(0.5);
    // idle: wander toward shapes so touch/no-mouse still animates
    let qx = mouse.x, qy = mouse.y;
    if (!mouse.inside) {
      const s = placed[Math.floor(time / 3) % placed.length];
      qx = s.x + Math.cos(time) * s.r * 0.4; qy = s.y + Math.sin(time * 1.3) * s.r * 0.4;
    }
    const sigma = Math.max(CS * 4.5, 90);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const cx = c * CS + CS / 2, cy = r * CS + CS / 2;
      const d2 = (cx - qx) ** 2 + (cy - qy) ** 2;
      const h = Math.exp(-d2 / (2 * sigma * sigma));
      if (h < 0.04) continue;
      ctx.globalAlpha = h * 0.85;
      ctx.fillStyle = h > 0.6 ? colors.warn : h > 0.3 ? colors.accent : colors.accent2;
      ctx.fillRect(c * CS + 1, r * CS + 1, CS - 2, CS - 2);
    }
    ctx.globalAlpha = 1;
    drawGrid(true);
    // attention links to each object (softmax over -distance)
    const ws = placed.map((s) => Math.exp(-Math.hypot(s.x - qx, s.y - qy) / 220));
    const z = ws.reduce((a, b) => a + b, 0);
    placed.forEach((s, i) => {
      const w = ws[i] / z;
      ctx.strokeStyle = colors.accent; ctx.globalAlpha = 0.15 + w * 0.85; ctx.lineWidth = 1 + w * 3;
      ctx.beginPath(); ctx.moveTo(qx, qy);
      ctx.quadraticCurveTo((qx + s.x) / 2, Math.min(qy, s.y) - 50, s.x, s.y); ctx.stroke();
      ctx.globalAlpha = 1;
      tag(`${(w * 100).toFixed(0)}%`, s.x - 14, s.y - s.r - 24, colors.surface, colors.accent, 11);
    });
    ctx.lineWidth = 2; corners(qx - 16, qy - 16, 32, 32, colors.text, 8);
    tag("query", qx + 20, qy - 8, colors.text, colors.bg, 10);
  }

  function drawConv(dt) {
    drawShapesBase(0.35);
    // sweep only the visible band of the image (below the nav, above the bottom fade)
    const r0 = Math.floor(rows * 0.14), r1 = Math.floor(rows * 0.9);
    const span = (r1 - r0) * cols;
    const step = dt * span / 5; // one full sweep ≈ 5 s
    const prev = kernelPos;
    kernelPos = (kernelPos + step) % span;
    const at = (p) => (r0 + Math.floor(p / cols)) * cols + (Math.floor(p) % cols);
    const kc = Math.floor(kernelPos) % cols, kr = r0 + Math.floor(kernelPos / cols);
    // light up the cells the kernel just covered; value = edge strength (a Sobel-like response)
    const occ = (c, r) => classAt(c * CS + CS / 2, r * CS + CS / 2) > 0 ? 1 : 0;
    const edge = (c, r) => Math.abs(occ(c + 1, r) - occ(c - 1, r)) + Math.abs(occ(c, r + 1) - occ(c, r - 1));
    for (let k = 0; k < Math.ceil(step) + 2; k++) trail[at((kernelPos - k + span) % span)] = 1;
    const total = cols * rows;
    for (let i = 0; i < total; i++) {
      if (trail[i] < 0.01) continue;
      const c = i % cols, r = (i / cols) | 0;
      const e = Math.min(edge(c, r), 2) / 2;
      if (e > 0) {
        ctx.globalAlpha = trail[i] * (0.35 + e * 0.65);
        ctx.fillStyle = e > 0.9 ? colors.accent : colors.accent2;
        ctx.fillRect(c * CS + 1, r * CS + 1, CS - 2, CS - 2);
      }
      trail[i] *= Math.pow(0.5, dt / 2.4); // fade over a few seconds
    }
    ctx.globalAlpha = 1;
    drawGrid(false);
    ctx.lineWidth = 2; ctx.strokeStyle = colors.warn;
    ctx.strokeRect((kc - 1) * CS, (kr - 1) * CS, CS * 3, CS * 3);
    tag("conv 3×3 · stride 1", Math.min((kc - 1) * CS, W - 150), Math.max((kr - 1) * CS - 20, 2), colors.warn, colors.bg, 10);
  }

  function drawCursor() {
    if (!mouse.inside || mode === "attention") return;
    ctx.strokeStyle = colors.text; ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mouse.x - 14, mouse.y); ctx.lineTo(mouse.x + 14, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - 14); ctx.lineTo(mouse.x, mouse.y + 14);
    ctx.stroke(); ctx.globalAlpha = 1;
    // pixel readout under cursor
    const c = Math.floor(mouse.x / CS), r = Math.floor(mouse.y / CS);
    const cl = classAt(mouse.x, mouse.y);
    tag(`px(${c},${r}) · ${cl ? ["circle", "square", "triangle"][cl - 1] : "background"}`, mouse.x + 12, mouse.y + 12, colors.surface, colors.text, 10);
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!reduceMotion) time += dt;
    placed = SHAPES.map(place);
    ctx.clearRect(0, 0, W, H);
    if (mode === "detect") drawDetect();
    else if (mode === "segment") drawSegment();
    else if (mode === "attention") drawAttention();
    else drawConv(reduceMotion ? 0 : dt);
    drawCursor();
  }

  /* ---- wiring ---- */
  window.__setSceneMode = function (m) {
    if (!MODES[m]) return;
    mode = m;
    const cap = document.getElementById("modeCaption");
    if (cap) cap.textContent = "↳ " + MODES[m];
    document.querySelectorAll("#modes button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.mode === m));
  };

  readColors();
  resize();
  window.addEventListener("resize", resize);
  const hero = canvas.parentElement;
  hero.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    mouse.inside = e.pointerType === "mouse";
  });
  hero.addEventListener("pointerleave", () => { mouse.inside = false; });
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(hero);
  window.__setSceneMode("detect");
  requestAnimationFrame(frame);
})();
