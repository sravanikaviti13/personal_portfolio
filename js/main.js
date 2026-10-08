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
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- basic profile wiring ---------- */
  $("#heroName").textContent = p.name;
  $("#loc").textContent = p.location;
  $("#intro").textContent = p.intro;
  $("#cvBtn").href = p.cv;
  $("#ghBtn").href = $("#ghBtn2").href = p.github;
  $("#liBtn").href = $("#liBtn2").href = p.linkedin;
  $("#mailLink").href = "mailto:" + p.email;
  $("#year").textContent = new Date().getFullYear();

  /* ---------- about ---------- */
  $("#aboutText").innerHTML = DATA.about.paragraphs.map((t) => `<p>${t}</p>`).join("");
  $("#aboutNow").innerHTML = DATA.about.now.map((r) => `<dt>${r.k}</dt><dd>${r.v}</dd>`).join("");

  /* ---------- experience tabs ---------- */
  const tabs = $("#expTabs"), panel = $("#expPanel");
  function showExp(i, focus) {
    $$("button", tabs).forEach((b, j) => { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; });
    const e = DATA.experience[i];
    panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
    panel.innerHTML =
      `<h3>${e.role}</h3><p class="org">${e.org}</p><p class="meta">${e.period} · ${e.place}</p>` +
      (e.groups
        ? e.groups.map((g) => `<h4 class="grp">${g.title}</h4><ul>${g.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`).join("")
        : `<ul>${e.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`) +
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

  /* ---------- projects carousel ---------- */
  const track = $("#projectGrid"), dots = $("#dots"), prevBtn = $("#prevBtn"), nextBtn = $("#nextBtn");
  DATA.projects.forEach((pr) => {
    const c = el("a", "card pcard",
      `<span class="kicker">${pr.kicker}</span><h3>${pr.title}</h3><p>${pr.summary}</p>` +
      `<div class="pmetrics">${pr.metrics.map((x) => `<div><b>${x.v}</b><span>${x.l}</span></div>`).join("")}</div>` +
      `<div class="tags">${pr.stack.slice(0, 4).map((t) => `<span class="tag">${t}</span>`).join("")}</div>` +
      `<span class="more">View project →</span>`);
    c.href = "project.html?id=" + encodeURIComponent(pr.id);
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    });
    track.appendChild(c);
    const d = el("button", "dot");
    d.type = "button";
    d.setAttribute("aria-label", "Go to " + pr.title);
    d.addEventListener("click", () => track.scrollTo({ left: c.offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" }));
    dots.appendChild(d);
  });
  const cards = $$(".pcard", track), dotEls = $$(".dot", dots);
  function syncCarousel() {
    const t = track.getBoundingClientRect();
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const vis = Math.min(r.right, t.right) - Math.max(r.left, t.left);
      dotEls[i].classList.toggle("on", vis > r.width * 0.6);
    });
    const max = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = track.scrollLeft < 4;
    nextBtn.disabled = track.scrollLeft > max - 4;
    const fits = max < 4; // everything already visible: hide the controls
    prevBtn.hidden = nextBtn.hidden = dots.hidden = fits;
  }
  const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
  prevBtn.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }));
  nextBtn.addEventListener("click", () => track.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }));
  track.addEventListener("scroll", () => requestAnimationFrame(syncCarousel), { passive: true });
  addEventListener("resize", syncCarousel);
  syncCarousel();

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
  // Clicking the email icon copies the address and also opens the default mail app (if there is one)
  $("#mailLink").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(p.email); say("Email copied: " + p.email); }
    catch (e) { say(p.email); }
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
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach((n, i) => { n.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(n); });
})();
