(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const p = DATA.profile;

  /* ---------- basic profile wiring ---------- */
  $("#heroName").textContent = p.name;
  $("#loc").textContent = p.location;
  $("#tagline").textContent = p.tagline;
  $("#cvBtn").href = p.cv;
  $("#ghBtn").href = $("#ghBtn2").href = p.github;
  $("#liBtn").href = $("#liBtn2").href = p.linkedin;
  $("#mailLink").href = "mailto:" + p.email;
  $("#mailLink").textContent = p.email;
  $("#year").textContent = new Date().getFullYear();

  const img = new Image();
  img.alt = p.name;
  img.onload = () => { $("#avatar").innerHTML = ""; $("#avatar").appendChild(img); };
  img.src = p.photo;

  /* ---------- hero demo modes ---------- */
  $$("#modes button").forEach((b) => b.addEventListener("click", () => window.__setSceneMode(b.dataset.mode)));

  /* ---------- typing role ---------- */
  const roleEl = $("#roleText");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    roleEl.textContent = p.roles[0];
  } else {
    let ri = 0, ci = 0, del = false;
    (function tick() {
      const word = p.roles[ri];
      ci += del ? -1 : 1;
      roleEl.textContent = word.slice(0, ci);
      let wait = del ? 28 : 70;
      if (!del && ci === word.length) { del = true; wait = 1700; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % p.roles.length; wait = 350; }
      setTimeout(tick, wait);
    })();
  }

  /* ---------- stats with count-up ---------- */
  const statsEl = $("#stats");
  DATA.stats.forEach((s) => {
    const li = el("li", "reveal", `<strong data-v="${s.value}" data-d="${s.decimals || 0}" data-pre="${s.prefix || ""}" data-suf="${s.suffix || ""}">${s.prefix || ""}0${s.suffix || ""}</strong><span>${s.label}</span>`);
    statsEl.appendChild(li);
  });
  function countUp(node) {
    const target = +node.dataset.v, d = +node.dataset.d, pre = node.dataset.pre, suf = node.dataset.suf;
    if (reduce) { node.textContent = pre + target.toFixed(d) + suf; return; }
    const t0 = performance.now(), dur = 1400;
    (function step(now) {
      const k = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      node.textContent = pre + (target * e).toFixed(d) + suf;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- about ---------- */
  $("#aboutText").innerHTML = DATA.about.paragraphs.map((t) => `<p>${t}</p>`).join("");
  $("#aboutNow").innerHTML = DATA.about.now.map((r) => `<dt>${r.k}</dt><dd>${r.v}</dd>`).join("");

  /* ---------- pipeline stepper ---------- */
  const pipe = $("#pipe"), pipeDetail = $("#pipeDetail");
  function showStage(i, focus) {
    $$("button", pipe).forEach((b, j) => {
      b.setAttribute("aria-selected", j === i);
      b.tabIndex = j === i ? 0 : -1;
    });
    const s = DATA.pipeline[i];
    pipeDetail.classList.remove("swap"); void pipeDetail.offsetWidth; pipeDetail.classList.add("swap");
    pipeDetail.innerHTML = `<p class="mono">${s.tool}</p><p>${s.text}</p>`;
    if (focus) $$("button", pipe)[i].focus();
  }
  DATA.pipeline.forEach((s, i) => {
    const b = el("button", "", `<small>0${i + 1}</small>${s.title}`);
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => showStage(i));
    b.addEventListener("mouseenter", () => matchMedia("(hover:hover)").matches && showStage(i));
    pipe.appendChild(b);
  });
  pipe.addEventListener("keydown", (e) => {
    const cur = $$("button", pipe).findIndex((b) => b.getAttribute("aria-selected") === "true");
    const n = DATA.pipeline.length;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); showStage((cur + 1) % n, true); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); showStage((cur - 1 + n) % n, true); }
  });
  showStage(0);

  /* ---------- experience tabs ---------- */
  const tabs = $("#expTabs"), panel = $("#expPanel");
  function showExp(i, focus) {
    $$("button", tabs).forEach((b, j) => { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; });
    const e = DATA.experience[i];
    panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
    panel.innerHTML =
      `<h3>${e.role}</h3><p class="org">${e.org}</p><p class="meta">${e.period} · ${e.place}</p>` +
      `<ul>${e.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>` +
      `<div class="tags">${e.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>`;
    if (focus) $$("button", tabs)[i].focus();
  }
  DATA.experience.forEach((e, i) => {
    const b = el("button", "", `<b>${e.org}</b>${e.role.replace(/ \(.*\)/, "")}<br><span>${e.period}</span>`);
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => showExp(i));
    tabs.appendChild(b);
  });
  tabs.addEventListener("keydown", (e) => {
    const cur = $$("button", tabs).findIndex((b) => b.getAttribute("aria-selected") === "true");
    const n = DATA.experience.length;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); showExp((cur + 1) % n, true); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); showExp((cur - 1 + n) % n, true); }
  });
  showExp(0);

  /* ---------- projects ---------- */
  const CATS = { all: "All", vision: "Computer vision", gen: "Generative", nlp: "NLP", applied: "Applied ML" };
  const filters = $("#filters"), grid = $("#projectGrid");
  Object.entries(CATS).forEach(([k, label]) => {
    const b = el("button", "chip", label);
    b.type = "button";
    b.setAttribute("aria-pressed", k === "all");
    b.addEventListener("click", () => {
      $$(".chip", filters).forEach((c) => c.setAttribute("aria-pressed", c === b));
      $$(".pcard", grid).forEach((c) => c.classList.toggle("hide", k !== "all" && c.dataset.cat !== k));
    });
    filters.appendChild(b);
  });
  DATA.projects.forEach((pr) => {
    const c = el("button", "card pcard reveal",
      `<span class="kicker">${pr.kicker}</span><h3>${pr.title}</h3><p>${pr.summary}</p>` +
      `<div class="pmetrics">${pr.metrics.map((m) => `<div><b>${m.v}</b><span>${m.l}</span></div>`).join("")}</div>` +
      `<div class="tags">${pr.stack.slice(0, 4).map((t) => `<span class="tag">${t}</span>`).join("")}</div>` +
      `<span class="more">details →</span>`);
    c.type = "button";
    c.dataset.cat = pr.cat;
    c.addEventListener("click", () => openModal(pr));
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    });
    grid.appendChild(c);
  });

  const modal = $("#modal");
  function openModal(pr) {
    $("#modalBody").innerHTML =
      `<span class="mono" style="color:var(--accent-2);font-size:.78rem">${pr.kicker}</span>` +
      `<h3 id="mTitle">${pr.title}</h3><p style="color:var(--muted)">${pr.summary}</p>` +
      `<div class="pmetrics">${pr.metrics.map((m) => `<div><b>${m.v}</b><span>${m.l}</span></div>`).join("")}</div>` +
      `<ul>${pr.details.map((d) => `<li>${d}</li>`).join("")}</ul>` +
      `<div class="tags">${pr.stack.map((t) => `<span class="tag">${t}</span>`).join("")}</div>` +
      (pr.repo ? `<div class="actions"><a class="btn primary" href="${pr.repo}" target="_blank" rel="noopener">View on GitHub ↗</a></div>` : "");
    modal.showModal();
  }
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  /* ---------- skills ---------- */
  const sg = $("#skillGrid");
  DATA.skills.forEach((g) => {
    const c = el("div", "card sgroup reveal", `<h3>${g.group}</h3>` + g.items.map((i) => `<span class="pill">${i}</span>`).join(""));
    sg.appendChild(c);
  });
  $("#skillSearch").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    let any = false;
    $$(".sgroup", sg).forEach((g) => {
      let hits = 0;
      $$(".pill", g).forEach((pl) => {
        const m = q && pl.textContent.toLowerCase().includes(q);
        pl.classList.toggle("hit", !!m);
        pl.classList.toggle("dim", !!q && !m);
        if (m) hits++;
      });
      g.classList.toggle("hide", !!q && !hits);
      if (!q || hits) any = true;
    });
    $("#skillEmpty").hidden = any;
  });

  /* ---------- education ---------- */
  $("#eduList").innerHTML = DATA.education.map((e) =>
    `<div class="card reveal"><h3>${e.degree}</h3><p class="school">${e.school}</p><p class="meta mono">${e.period}</p>${e.lines.map((l) => `<p>${l}</p>`).join("")}</div>`
  ).join("");

  /* ---------- toast + copy email ---------- */
  const toast = $("#toast");
  function say(msg) {
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove("show"), 1800);
  }
  $("#copyBtn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(p.email); say("Email copied"); }
    catch { say(p.email); }
  });

  /* ---------- theme ---------- */
  $("#themeBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    window.__sceneRefresh && window.__sceneRefresh();
  });

  /* ---------- mobile menu ---------- */
  const navEl = $("nav"), menuBtn = $("#menuBtn");
  menuBtn.addEventListener("click", () => {
    const open = navEl.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  $$("#navlinks a").forEach((a) => a.addEventListener("click", () => { navEl.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); }));

  /* ---------- scroll: progress, nav state, active link ---------- */
  const bar = $("#progress"), nav = $("#nav");
  function onScroll() {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + "%";
    nav.classList.toggle("scrolled", h.scrollTop > 10);
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const links = $$("#navlinks a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = $(a.getAttribute("href")); s && spy.observe(s); });

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      const num = $("strong[data-v]", en.target);
      if (num) countUp(num);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach((n, i) => { n.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(n); });
})();
