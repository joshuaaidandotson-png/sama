/* ===================== Editable data ===================== */
const DATA = {
  // Board banners ("Label: answer"). Swap the Academic / Personal labels here.
  bannerLabels: { academic: "Proudest academic achievement", personal: "Current goal" },
  // Cumulative Crust POS locations — approximate, based on Joshua's recollection
  pos: { labels: ["Jun", "Jul", "Aug", "Sep", "Oct"], values: [6, 10, 17, 22, 30], suffix: "+" },
  inspection: { score: 99, max: 100 },
  tiktok: { gained: 1000, axisMax: 1000 },
  team: 7,
  hardware: { min: 1000, max: 5000 },
  gpaUH: 3.57,
  gpaLSC: 3.6,
  credits: { uh: 33, lsc: 15, total: 120 },      // 120 = UH 2026–27 BBA Accounting requirement
  gtaRelease: "2026-11-19T00:00:00",               // Rockstar Games official date
  birthday: { month: 3, day: 20 },
  // "Games I play" — a favorites mix, NOT hours played (equal shares until Joshua says otherwise)
  games: [["#1 GTA", 3], ["#2 Shinobi Life II (Roblox)", 2], ["#3 Overwatch", 1]],
  // Popover text = Joshua's own source notes for each skill
  skills: {
    "Internal Controls": "DeCA / Gifted &amp; Talented Kid's Academy",
    "Audit Documentation": "Gifted &amp; Talented Kid's Academy audit-readiness",
    "Excel": "Coursework or work",
    "QuickBooks": "Coursework or work",
    "POS Administration": "Crust Pizza Co.",
    "JIRA": "Work tool",
    "Monday.com": "Work tool",
    "AI Automation & Data Validation": "Crust data audits",
    "Vendor Management": "RosperTech",
    "German (A2)": "Lived in Wiesbaden, Germany"
  }
};
/* ========================================================= */
const C1 = "#ffd2ad", C2 = "#f4a6b8", C3 = "#b9d4ff", C4 = "#c8f0c0", TRACK = "rgba(255,255,255,.16)";
const svg = (w, h, inner, label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label || ""}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
function donut(parts, center, sub, label) {
  const total = parts.reduce((a, p) => a + p[1], 0), r = 40, cx = 60, cy = 60;
  let acc = 0, segs = "";
  parts.forEach(([, v, col], i) => {
    const gap = parts.length > 1 ? 0.012 : 0, frac = v / total;
    segs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="18" pathLength="1"
      style="--len:${Math.max(frac - gap, 0.004)};animation-delay:${0.2 + i * 0.15}s" stroke-dashoffset="${-acc}" transform="rotate(-90 ${cx} ${cy})" class="seg"/>`;
    acc += frac;
  });
  return svg(120, 120, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${TRACK}" stroke-width="18"/>${segs}
    <text x="60" y="61" text-anchor="middle" class="t">${center}</text><text x="60" y="75" text-anchor="middle" class="s">${sub}</text>`, label);
}
function legend(items) { return `<div class="legend">${items.map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join("")}</div>`; }
function gauge(v, max, label) {
  const a = Math.PI * Math.min(v / max, 1), r = 46, ex = 60 - r * Math.cos(a), ey = 66 - r * Math.sin(a);
  return svg(120, 84, `<path d="M14 66A46 46 0 0 1 106 66" fill="none" stroke="${TRACK}" stroke-width="12" stroke-linecap="round"/>
    <path d="M14 66A46 46 0 0 1 ${ex.toFixed(2)} ${ey.toFixed(2)}" fill="none" stroke="${C1}" stroke-width="12" stroke-linecap="round" pathLength="1" class="draw"/>
    <text x="60" y="62" text-anchor="middle" class="t">${v.toFixed(2).replace(/0$/, "")}</text><text x="60" y="80" text-anchor="middle" class="s">of ${max.toFixed(1)}</text>`, label);
}
const R = {
  pos() {
    const { labels, values, suffix } = DATA.pos, w = 300, h = 150, p = 22, top = 18, base = h - 22, max = Math.max(...values) * 1.1;
    const x = i => p + i * (w - 2 * p) / (values.length - 1), y = v => base - v / max * (base - top);
    const d = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
    const grid = [0.25, 0.5, 0.75].map(f => `<line x1="${p}" x2="${w - p}" y1="${base - f * (base - top)}" y2="${base - f * (base - top)}" stroke="rgba(255,255,255,.1)"/>`).join("");
    return svg(w, h, `<defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C1}" stop-opacity=".5"/><stop offset="1" stop-color="${C1}" stop-opacity="0"/></linearGradient></defs>
      ${grid}<path d="${d} L${x(values.length - 1)},${base} L${x(0)},${base}Z" fill="url(#pg)" class="fade"/>
      <path d="${d}" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round" pathLength="1" class="draw"/>
      ${values.map((v, i) => `<g class="fade"><circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#fff"/><text x="${x(i)}" y="${y(v) - 9}" text-anchor="middle" class="s">${v}${i === values.length - 1 ? suffix : ""}</text></g><text x="${x(i)}" y="${h - 6}" text-anchor="middle" class="s">${labels[i]}</text>`).join("")}`, "POS locations by month");
  },
  inspect() {
    const { score, max } = DATA.inspection;
    return donut([["Points earned", score, C1], ["Points deducted", max - score, C2]], `${score}/${max}`, "score", "Inspection score pie") +
      legend([[`Earned (${score})`, C1], [`Deducted (${max - score})`, C2]]);
  },
  tiktok() {
    const { gained, axisMax } = DATA.tiktok, w = 300, L = 10, Wd = w - 20, ticks = [0, .25, .5, .75, 1];
    return svg(w, 92, `${ticks.map(t => `<line x1="${L + t * Wd}" x2="${L + t * Wd}" y1="14" y2="58" stroke="rgba(255,255,255,.14)"/><text x="${L + t * Wd}" y="74" text-anchor="middle" class="s">${Math.round(t * axisMax).toLocaleString()}</text>`).join("")}
      <rect x="${L}" y="24" width="${Wd}" height="24" rx="12" fill="${TRACK}"/>
      <rect x="${L}" y="24" width="${gained / axisMax * Wd}" height="24" rx="12" fill="${C2}" class="grow"/>
      <text x="${L + 10}" y="41" class="s" fill="#3a2420" style="fill:#3a2420;font-weight:600">~${gained.toLocaleString()} followers gained</text>
      <text x="${w / 2}" y="90" text-anchor="middle" class="s">Followers (approx.)</text>`, "TikTok followers gained bar chart");
  },
  team() {
    const n = DATA.team, w = 300, top = 26, lev = 96, xs = i => 24 + i * (w - 48) / (n - 1);
    const lines = Array.from({ length: n }, (_, i) => `<path d="M150 ${top + 18} V64 H${xs(i)} V${lev - 14}" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1.4" pathLength="1" class="draw" style="animation-delay:${.2 + i * .06}s"/>`).join("");
    const nodes = Array.from({ length: n }, (_, i) => `<g class="fade" style="animation-delay:${.6 + i * .06}s"><circle cx="${xs(i)}" cy="${lev}" r="13" fill="rgba(255,255,255,.16)" stroke="${C1}"/><circle cx="${xs(i)}" cy="${lev - 4}" r="3.6" fill="#fff"/><path d="M${xs(i) - 6} ${lev + 7}a6 5 0 0 1 12 0z" fill="#fff"/></g>`).join("");
    return svg(w, 124, `${lines}<rect x="104" y="${top - 16}" width="92" height="34" rx="17" fill="${C1}"/><text x="150" y="${top + 5}" text-anchor="middle" class="t" style="fill:#3a2420;font-size:13px">Joshua</text>${nodes}
      <text x="150" y="122" text-anchor="middle" class="s">${n} team members · Assistant Store Manager</text>`, "Org chart: Joshua supervising 7");
  },
  range() {
    const { min, max } = DATA.hardware, w = 240, s = v => 14 + v / 6000 * (w - 28);
    return svg(w, 80, `<line x1="14" x2="${w - 14}" y1="34" y2="34" stroke="${TRACK}" stroke-width="10" stroke-linecap="round"/>
      <line x1="${s(min)}" x2="${s(max)}" y1="34" y2="34" stroke="${C1}" stroke-width="10" stroke-linecap="round" pathLength="1" class="draw"/>
      <circle cx="${s(min)}" cy="34" r="7" fill="#fff" class="fade"/><circle cx="${s(max)}" cy="34" r="7" fill="#fff" class="fade"/>
      <text x="${s(min)}" y="18" text-anchor="middle" class="s">$1,000</text><text x="${s(max)}" y="18" text-anchor="middle" class="s">$5,000</text>
      <text x="14" y="62" class="s">$0</text><text x="${w - 14}" y="62" text-anchor="end" class="s">$6,000</text>`, "Hardware cost range per location");
  },
  gpa_uh() { return gauge(DATA.gpaUH, 4, "UH GPA gauge"); },
  gpa_lsc() { return gauge(DATA.gpaLSC, 4, "Lone Star GPA gauge"); },
  credits() {
    const { uh, lsc, total } = DATA.credits, w = 320, L = 8, Wd = w - 16, s = v => v / total * Wd, done = uh + lsc;
    return svg(w, 96, `<text x="${L}" y="16" class="t">${done} <tspan class="s">of ${total} hours · ${Math.round(done / total * 100)}%</tspan></text>
      <rect x="${L}" y="28" width="${Wd}" height="22" rx="11" fill="${TRACK}"/>
      <g class="grow"><rect x="${L}" y="28" width="${s(uh)}" height="22" rx="11" fill="${C1}"/><rect x="${L + s(uh) - 11}" y="28" width="${s(lsc) + 11}" height="22" rx="11" fill="${C2}"/><rect x="${L + s(uh) - 11}" y="28" width="12" height="22" fill="${C1}"/></g>
      ${[30, 60, 90].map(t => `<line x1="${L + s(t)}" x2="${L + s(t)}" y1="26" y2="52" stroke="rgba(255,255,255,.35)" stroke-dasharray="2 2"/><text x="${L + s(t)}" y="66" text-anchor="middle" class="s">${t}</text>`).join("")}
      <text x="${L}" y="88" class="s">■ UH ${uh} hrs</text><text x="${L + 90}" y="88" class="s" style="fill:${C2}">■ Lone Star ${lsc} hrs</text><text x="${w - 8}" y="88" text-anchor="end" class="s">${total - done} to go</text>`, "Credit hours toward graduation");
  },
  games() {
    const cols = [C1, C2, C3, C4], parts = DATA.games.map(([n, v], i) => [n, v, cols[i % 4]]);
    return donut(parts, "Top 3", "ranked", "Top games donut chart") + legend(parts.map(([n, , c]) => [n, c]));
  },
  gta() { return `<div class="count" data-count="${DATA.gtaRelease}" aria-live="polite"></div>`; },
  bday() {
    const now = new Date(), { month, day } = DATA.birthday;
    let t = new Date(now.getFullYear(), month - 1, day);
    if (t <= now) t = new Date(now.getFullYear() + 1, month - 1, day);
    return `<div class="count" data-count="${t.toISOString()}" aria-live="polite"></div>`;
  }
};
document.querySelectorAll("[data-banner]").forEach(el => { const v = DATA.bannerLabels[el.dataset.banner]; if (v) el.textContent = v; });
document.querySelectorAll("[data-chart]").forEach(el => { const f = R[el.dataset.chart]; if (f) el.innerHTML = f(); });
/* countdowns */
function tickCounts() {
  document.querySelectorAll("[data-count]").forEach(el => {
    let ms = Math.max(0, new Date(el.dataset.count) - new Date());
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    el.innerHTML = [[d, "days"], [h, "hrs"], [m, "min"], [s, "sec"]].map(([v, l]) => `<div><b>${String(v).padStart(2, "0")}</b><span>${l}</span></div>`).join("");
  });
}
tickCounts(); setInterval(tickCounts, 1000);
/* clock in visitor's time zone */
const clock = document.getElementById("clock");
function tick() { const d = new Date(); clock.dateTime = d.toISOString(); clock.textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(d); }
tick(); setInterval(tick, 15000);
/* contact modal */
const modal = document.getElementById("contact"); let lastFocus;
function openModal() { lastFocus = document.activeElement; modal.hidden = false; requestAnimationFrame(() => modal.classList.add("open")); modal.querySelector("[data-close]").focus(); }
function closeModal() { modal.classList.remove("open"); setTimeout(() => { modal.hidden = true; lastFocus && lastFocus.focus(); }, 250); }
document.querySelectorAll('[data-open="contact"]').forEach(b => b.addEventListener("click", openModal));
modal.addEventListener("click", e => { if (e.target === modal || e.target.closest("[data-close]")) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
/* skills sphere */
const sphere = document.getElementById("sphere");
if (sphere) {
  const pop = document.getElementById("skillpop"), names = Object.keys(DATA.skills), N = names.length, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pts = names.map((n, i) => { const phi = Math.acos(1 - 2 * (i + .5) / N), th = Math.PI * (1 + Math.sqrt(5)) * i; return { n, x: Math.sin(phi) * Math.cos(th), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(th) }; });
  const els = pts.map(p => { const b = document.createElement("button"); b.type = "button"; b.textContent = p.n; b.addEventListener("click", () => { pop.innerHTML = `<button type="button" class="popx" aria-label="Close">&times;</button><b>${p.n}</b>${DATA.skills[p.n]}`; pop.hidden = false; pop.querySelector(".popx").addEventListener("click", ev => { ev.stopPropagation(); pop.hidden = true; b.focus(); }); }); sphere.appendChild(b); return b; });
  let ax = 0.3, ay = 0, vx = 0, vy = reduce ? 0 : 0.004, drag = null;
  function render() {
    const r = Math.min(sphere.clientWidth, sphere.clientHeight) * 0.42, cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    pts.forEach((p, i) => {
      const x1 = p.x * cy + p.z * sy, z1 = -p.x * sy + p.z * cy, y2 = p.y * cx - z1 * sx, z2 = p.y * sx + z1 * cx, sc = (z2 + 3) / 4;
      els[i].style.transform = `translate(-50%,-50%) translate(${x1 * r * 1.25}px,${y2 * r}px) scale(${sc})`;
      els[i].style.opacity = 0.35 + 0.65 * (z2 + 1) / 2; els[i].style.zIndex = Math.round((z2 + 1) * 50);
    });
  }
  function loop() { if (!drag) { ay += vy; ax += vx; vx *= .95; if (Math.abs(vy) > .004) vy *= .95; else if (!reduce) vy = .004; } render(); requestAnimationFrame(loop); }
  document.addEventListener("click", e => { if (!pop.hidden && !pop.contains(e.target) && !(e.target.closest && e.target.closest("#sphere button"))) pop.hidden = true; });
  document.addEventListener("keydown", e => { if (e.key === "Escape") pop.hidden = true; });
  sphere.addEventListener("pointerdown", e => { if (e.target.tagName === "BUTTON") return; drag = { x: e.clientX, y: e.clientY }; sphere.setPointerCapture(e.pointerId); pop.hidden = true; });
  sphere.addEventListener("pointermove", e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; vy = dx * .0025; vx = dy * .0025; ay += vy; ax += vx; drag = { x: e.clientX, y: e.clientY }; });
  sphere.addEventListener("pointerup", () => drag = null);
  render(); loop();
}
/* entrance */


// Masonry packing: each panel spans rows equal to its content height, so no blank space or gaps.
(function(){
  function pack(){
    var on=window.matchMedia('(min-width: 900px)').matches;
    document.querySelectorAll('.dash').forEach(function(d){
      if(d.hidden)return;
      d.classList.toggle('masonry',on);
      if(!on){Array.prototype.forEach.call(d.children,function(el){el.style.gridRow='';});return;}
      Array.prototype.forEach.call(d.children,function(el){
        el.style.gridRow='auto';el.style.alignSelf='';el.classList.remove('stretched');
        var h=el.offsetHeight+16;
        el.style.gridRow='span '+Math.ceil(h/2);
      });
      // fill: grow each panel down to the next panel below it (or the board's bottom) so no gaps remain
      var kids=Array.prototype.slice.call(d.children),R=kids.map(function(e){var t=e.offsetTop,l=e.offsetLeft;return {top:t,left:l,bottom:t+e.offsetHeight,right:l+e.offsetWidth};});
      var maxB=Math.max.apply(null,R.map(function(r){return r.bottom;}));
      kids.forEach(function(el,i){
        var r=R[i],target=maxB;
        R.forEach(function(o,j){if(j!==i&&o.top>=r.bottom-1&&o.left<r.right-1&&o.right>r.left+1)target=Math.min(target,o.top-16);});
        var extra=target-r.bottom;
        if(extra>2){var n=parseInt(el.style.gridRow.replace('span ',''),10)+Math.floor(extra/2);el.style.gridRow='span '+n;el.style.alignSelf='stretch';el.classList.add('stretched');}
        else {el.style.alignSelf='';el.classList.remove('stretched');}
      });
    });
  }
  var t;function later(){clearTimeout(t);t=setTimeout(pack,60);}
  window.addEventListener('load',pack);window.addEventListener('resize',later);
  document.querySelectorAll('.dash img').forEach(function(i){if(!i.complete)i.addEventListener('load',later);});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(pack);
  window.samaPack=pack;pack();setTimeout(pack,900);setTimeout(pack,2000);
})();

// Single-page router: boards swap in place with a sideways slide; background never reloads.
(function(){
  var order=["professional","academic","personal","resume"];
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var boards={};document.querySelectorAll(".board").forEach(function(b){boards[b.dataset.board]=b;});
  var cur=null,busy=false;
  function stagger(b){if(reduce)return;Array.prototype.forEach.call(b.children,function(el,i){el.classList.remove("rise");void el.offsetWidth;el.style.animationDelay=(80+i*55)+"ms";el.classList.add("rise");});}
  function mark(k){document.querySelectorAll("[data-nav]").forEach(function(a){var on=a.dataset.nav===k&&a.classList.contains("tab");a.classList.toggle("active",on);if(on)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
    var b=boards[k];document.title=b.dataset.title.replace("&amp;","&")+" · Sama — Joshua Dotson";var f=document.getElementById("foot-title");if(f)f.innerHTML=b.dataset.title;document.body.dataset.page=k;}
  function show(k,push){
    if(!boards[k])k="professional";
    if(k===cur||busy)return;
    var from=cur?boards[cur]:null,to=boards[k];
    var dir=cur&&order.indexOf(k)<order.indexOf(cur)?"prev":"next";
    if(push)history.pushState({b:k},"","#"+k);
    mark(k);
    if(!from||reduce){if(from)from.hidden=true;to.hidden=false;cur=k;window.samaPack&&window.samaPack();if(!from)stagger(to);window.scrollTo(0,0);return;}
    busy=true;
    from.classList.add("out-"+dir);
    setTimeout(function(){
      from.hidden=true;from.classList.remove("out-"+dir);
      window.scrollTo(0,0);
      to.hidden=false;to.classList.add("in-"+dir);
      window.samaPack&&window.samaPack();stagger(to);
      requestAnimationFrame(function(){requestAnimationFrame(function(){to.classList.add("in-go");});});
      setTimeout(function(){to.classList.remove("in-"+dir,"in-go");busy=false;cur=k;},480);
      cur=k;
    },300);
  }
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest("a[href^='#']");if(!a)return;
    var k=a.getAttribute("href").slice(1);if(!boards[k])return;
    if(e.metaKey||e.ctrlKey||e.shiftKey)return;
    e.preventDefault();show(k,true);
  });
  window.addEventListener("popstate",function(){show((location.hash||"#professional").slice(1),false);});
  window.addEventListener("hashchange",function(){show((location.hash||"#professional").slice(1),false);});
  show((location.hash||"#professional").slice(1),false);
  window.samaShow=show;
})();
