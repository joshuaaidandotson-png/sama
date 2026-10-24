// Sama Studios PUBLIC top bar. Plain links only: no hover menus, no dropdowns, no burger menu (Joshua, Oct 24).
// The private side keeps its own copy (shared/sama-nav.js); do not sync that file over this one.
// mountNav(host,{groups:[{key,label,emoji,href}], active, account:{label,emoji,href}, brandHref})
const STAR="\u2726"; // ✦ the four-pointed star (Joshua's "star")
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n;};
const a=(href,c,...k)=>{const n=el("a",c);n.href=href;n.append(...k);return n;};
const star=()=>{const s=el("span","snav-star",STAR);s.setAttribute("aria-hidden","true");return s;};
export function mountNav(host,{groups,active,account,brandHref}){
  const bar=el("header","snav"); bar.setAttribute("role","banner");
  const brand=a(brandHref||"#home","snav-wm"+(active==="home"||active==="brand"?" on":""),el("span",null,"Sama Studios"));
  const nav=el("nav","snav-tabs"); nav.setAttribute("aria-label","Main");
  groups.forEach(g=>{ const t=a(g.href,"snav-t"+(g.key===active?" on":""),star(),el("span","snav-e",g.emoji||""),el("span","snav-l",g.label),star());
    if(g.key===active) t.setAttribute("aria-current","page"); nav.append(t); });
  const right=el("div","snav-r"); const clock=el("time","snav-clock"); right.append(clock);
  if(account&&account.href) right.append(a(account.href,"snav-login",el("span",null,account.emoji||"🔑"),el("span",null,account.label)));
  bar.append(brand,nav,right);
  const tick=()=>{const d=new Date();clock.dateTime=d.toISOString();clock.textContent=new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(d);};
  tick(); clearInterval(window.__snavT); window.__snavT=setInterval(tick,15000);
  host.replaceChildren(bar); return bar;
}
export const greeting=(d=new Date())=>{const h=d.getHours();return h<12?"Good morning":h<18?"Good afternoon":"Good evening";};
