// Sama Studios PUBLIC top bar. Tabs are plain links. The ONLY hover menu is on the 'Sama Studios' brand, with one item: Login (Joshua, Oct 24 5:13 AM).
// No other hover menus, dropdowns or burger menu.
// The private side keeps its own copy (shared/sama-nav.js); do not sync that file over this one.
// mountNav(host,{groups:[{key,label,emoji,href}], active, account:{label,emoji,href}, brandHref})
const STAR="\u2726"; // ✦ the four-pointed star (Joshua's "star")
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n;};
const a=(href,c,...k)=>{const n=el("a",c);n.href=href;n.append(...k);return n;};
const star=()=>{const s=el("span","snav-star",STAR);s.setAttribute("aria-hidden","true");return s;};
export function mountNav(host,{groups,active,account,brandHref}){
  const bar=el("header","snav"); bar.setAttribute("role","banner");
  const wm=a(brandHref||"#home","snav-wm"+(active==="home"||active==="brand"?" on":""),el("span",null,"Sama Studios"));
  const brand=el("div","snav-brand"); brand.append(wm);
  if(account&&account.href){ const m=el("div","snav-bmenu"); m.setAttribute("role","menu"); const li=a(account.href,"snav-bmi",el("span",null,account.emoji||"🔑"),el("span",null,account.label)); li.setAttribute("role","menuitem"); m.append(li); brand.append(m);
    wm.setAttribute("aria-haspopup","true"); wm.setAttribute("aria-expanded","false");
    // Touch (no hover): first tap on Sama Studios shows the Login item; a second tap goes home.
    wm.addEventListener("click",ev=>{ if(matchMedia("(hover: hover)").matches) return; if(!brand.classList.contains("open")){ ev.preventDefault(); ev.stopPropagation(); brand.classList.add("open"); wm.setAttribute("aria-expanded","true"); } },true);
    if(!window.__snavDoc){ window.__snavDoc=true; document.addEventListener("click",ev=>{ document.querySelectorAll(".snav-brand.open").forEach(x=>{ if(!x.contains(ev.target)){ x.classList.remove("open"); x.querySelector(".snav-wm")?.setAttribute("aria-expanded","false"); } }); }); } }
  const nav=el("nav","snav-tabs"); nav.setAttribute("aria-label","Main");
  groups.forEach(g=>{ const t=a(g.href,"snav-t"+(g.key===active?" on":""),el("span","snav-e",g.emoji||""),el("span","snav-l",g.label));
    if(g.key===active) t.setAttribute("aria-current","page"); nav.append(t); });
  const right=el("div","snav-r"); const clock=el("time","snav-clock"); right.append(clock);
  bar.append(brand,nav,right);
  const tick=()=>{const d=new Date();clock.dateTime=d.toISOString();clock.textContent=new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(d);};
  tick(); clearInterval(window.__snavT); window.__snavT=setInterval(tick,15000);
  host.replaceChildren(bar); return bar;
}
export const greeting=(d=new Date())=>{const h=d.getHours();return h<12?"Good morning":h<18?"Good afternoon":"Good evening";};
