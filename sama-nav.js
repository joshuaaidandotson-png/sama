// Sama Studios shared top bar (public + private use this SAME file; keep in sync with tools/sync_shared.sh).
// mountNav({mode:"public"|"private", groups:[{key,label,emoji,href,subs:[{href,emoji,label}]}], active, account:{label,href|onClick}, settings:{href}})
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n;};
const a=(href,c,...k)=>{const n=el("a",c);n.href=href;n.append(...k);return n;};
export function mountNav(host,{groups,active,account,settings,brandHref}){
  const bar=el("header","snav"); bar.setAttribute("role","banner");
  // brand + hover account menu
  const brand=el("div","snav-brand"+(active==="home"||active==="brand"?" on":"")); const bl=a(brandHref||"#/","snav-wm",el("span",null,"Sama Studios"));
  bl.setAttribute("aria-haspopup","true"); const bm=el("div","snav-menu snav-bmenu");
  const acc=account.href?a(account.href,"snav-mi",el("span",null,account.emoji||"🔑"),el("span",null,account.label)):el("button","snav-mi");
  if(!account.href){acc.type="button";acc.append(el("span",null,account.emoji||"👋"),el("span",null,account.label));acc.onclick=account.onClick;}
  bm.append(acc); brand.append(bl,bm);
  // groups
  const nav=el("nav","snav-tabs"); nav.setAttribute("aria-label","Main");
  groups.forEach(g=>{ const w=el("div","snav-g"+(g.key===active?" on":"")+(g.subs&&g.subs.length?" has-subs":""));
    const t=a(g.href,"snav-t",el("span","snav-e",g.emoji||""),el("span","snav-l",g.label)); if(g.key===active)t.setAttribute("aria-current","page"); w.append(t);
    if(g.subs&&g.subs.length){ const exp=el("button","snav-x","▾"); exp.type="button"; exp.setAttribute("aria-label","Show "+g.label+" pages"); exp.setAttribute("aria-expanded","false");
      exp.onclick=ev=>{ev.stopPropagation();const o=w.classList.toggle("open");exp.setAttribute("aria-expanded",String(o));}; w.append(exp);
      const m=el("div","snav-menu"); g.subs.forEach(s=>m.append(a(s.href,"snav-mi",el("span",null,s.emoji||"•"),el("span",null,s.label)))); w.append(m); }
    nav.append(w); });
  // phone: the account action also lives at the bottom of the menu (no hover on touch)
  const am=el("div","snav-g snav-accm"); const acc2=acc.cloneNode(true); acc2.className="snav-t"; if(!account.href) acc2.onclick=account.onClick; am.append(acc2); nav.append(am);
  const right=el("div","snav-r"); const clock=el("time","snav-clock"); right.append(clock);
  if(settings){ const s=a(settings.href,"snav-set"+(active==="settings"?" on":""),el("span",null,"⚙️")); s.setAttribute("aria-label","Sama Settings"); s.title="Sama Settings"; right.append(s); }
  const burger=el("button","snav-burger"); burger.type="button"; burger.setAttribute("aria-label","Menu"); burger.append(el("span"),el("span"),el("span"));
  burger.onclick=()=>{const o=bar.classList.toggle("menu-open");burger.setAttribute("aria-expanded",String(o));};
  bar.append(brand,nav,right,burger);
  bar.querySelectorAll(".snav-menu a,.snav-t").forEach(x=>x.addEventListener("click",()=>bar.classList.remove("menu-open")));
  const tick=()=>{const d=new Date();clock.dateTime=d.toISOString();clock.textContent=new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(d);};
  tick(); clearInterval(window.__snavT); window.__snavT=setInterval(tick,15000);
  intent(bar); host.replaceChildren(bar); return bar;
}
export const greeting=(d=new Date())=>{const h=d.getHours();return h<12?"Good morning":h<18?"Good afternoon":"Good evening";};

// Hover intent: open after a short pause, stay open while the pointer travels toward the menu (safe triangle),
// close shortly after leaving, and on outside click or Esc.
function intent(bar){
  const items=[...bar.querySelectorAll(".snav-brand,.snav-g.has-subs")]; let openEl=null, tOpen=0, tClose=0, leavePt=null;
  const desk=()=>matchMedia("(min-width:861px) and (hover:hover)").matches;
  const close=()=>{ clearTimeout(tClose); if(openEl) openEl.classList.remove("hov"); openEl=null; leavePt=null; document.removeEventListener("pointermove",track); };
  const open=w=>{ clearTimeout(tClose); if(openEl&&openEl!==w) openEl.classList.remove("hov"); openEl=w; w.classList.add("hov"); };
  const inTri=(p,a,b,c)=>{ const s=(p1,p2,p3)=>(p1.x-p3.x)*(p2.y-p3.y)-(p2.x-p3.x)*(p1.y-p3.y); const d1=s(p,a,b),d2=s(p,b,c),d3=s(p,c,a); return !((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0)); };
  function track(e){ if(!openEl||!leavePt) return; const m=openEl.querySelector(".snav-menu"); if(!m) return close(); const r=m.getBoundingClientRect(), p={x:e.clientX,y:e.clientY};
    if(p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom) return;
    if(inTri(p,leavePt,{x:r.left-8,y:r.top},{x:r.right+8,y:r.top})){ clearTimeout(tClose); tClose=setTimeout(close,450); return; }
    clearTimeout(tClose); tClose=setTimeout(close,120); }
  items.forEach(w=>{
    w.addEventListener("pointerenter",e=>{ if(e.pointerType!=="mouse"||!desk()) return; clearTimeout(tClose); leavePt=null; clearTimeout(tOpen); tOpen=setTimeout(()=>open(w),openEl?0:90); });
    w.addEventListener("pointerleave",e=>{ if(e.pointerType!=="mouse") return; clearTimeout(tOpen); if(openEl!==w) return; leavePt={x:e.clientX,y:e.clientY}; document.addEventListener("pointermove",track); tClose=setTimeout(close,280); });
    w.addEventListener("focusin",()=>{ if(desk()&&w.matches(":focus-within")&&document.querySelector(":focus-visible")) open(w); });
    w.addEventListener("focusout",e=>{ if(!w.contains(e.relatedTarget)&&openEl===w) close(); });
    w.querySelectorAll("a").forEach(x=>x.addEventListener("click",()=>{ close(); x.blur(); }));
  });
  if(window.__snavDoc) { document.removeEventListener("pointerdown",window.__snavDoc.d); document.removeEventListener("keydown",window.__snavDoc.k); }
  const d=e=>{ if(openEl&&!openEl.contains(e.target)) close(); if(bar.classList.contains("menu-open")&&!bar.contains(e.target)) bar.classList.remove("menu-open"); };
  const k=e=>{ if(e.key==="Escape"){ const o=openEl; close(); bar.classList.remove("menu-open"); if(o&&o.contains(document.activeElement)) document.activeElement.blur(); } };
  document.addEventListener("pointerdown",d); document.addEventListener("keydown",k); window.__snavDoc={d,k};
}
