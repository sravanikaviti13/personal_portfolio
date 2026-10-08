(function () {
  const root = document.getElementById("project");
  const id = new URLSearchParams(location.search).get("id");
  const list = DATA.projects;
  const i = list.findIndex((p) => p.id === id);

  document.getElementById("themeBtn").addEventListener("click", () => {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  if (i < 0) {
    document.title = "Project not found · Sravani Kaviti";
    root.innerHTML = '<h1>Project not found</h1><p class="lead2">That project doesn\'t exist. <a href="index.html#projects">See all projects</a>.</p>';
    return;
  }

  const pr = list[i];
  document.title = pr.title + " · Sravani Kaviti";
  const prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];

  root.innerHTML =
    `<p class="kicker mono">${pr.kicker}</p>` +
    `<h1>${pr.title}</h1>` +
    `<p class="lead2">${pr.summary}</p>` +
    `<div class="pmetrics big">${pr.metrics.map((m) => `<div><b>${m.v}</b><span>${m.l}</span></div>`).join("")}</div>` +
    (pr.repo ? `<p><a class="btn primary" href="${pr.repo}" target="_blank" rel="noopener">View code on GitHub ↗</a></p>` : "") +
    (pr.groups
      ? pr.groups.map((g) => `<h2 class="h-sm">${g.title}</h2><ul class="bullets">${g.bullets.map((d) => `<li>${d}</li>`).join("")}</ul>`).join("")
      : `<h2 class="h-sm">What I did</h2><ul class="bullets">${pr.details.map((d) => `<li>${d}</li>`).join("")}</ul>`) +
    (pr.images && pr.images.length
      ? `<h2 class="h-sm">Figures</h2>` + pr.images.map((im) =>
          `<figure class="shot"><a href="${im.src}" target="_blank" rel="noopener"><img src="${im.src}" alt="${im.caption.replace(/"/g, "&quot;")}" loading="lazy"></a><figcaption>${im.caption}</figcaption></figure>`).join("")
      : "") +
    `<h2 class="h-sm">Tools</h2><div class="tags">${pr.stack.map((t) => `<span class="tag">${t}</span>`).join("")}</div>` +
    `<nav class="pager" aria-label="More projects"><a href="project.html?id=${prev.id}">← ${prev.title}</a><a href="project.html?id=${next.id}">${next.title} →</a></nav>`;
})();
