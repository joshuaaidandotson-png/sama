// Public site: shared Sama nav + landing clock/greeting + clickable panels -> overview pages. Public content only.
import { mountNav, greeting } from "./sama-nav.js?v=13";
const BOARDS=[["professional","💼","Professional"],["academic","📚","Academic"],["personal","🌸","Social"],["resume","📄","Résumé"]];
const titleOf=p=>{const h=p.querySelector("h1,h3,.slabel,h2"); return h?h.textContent.trim().replace(/\s+/g," "):"";};
const panels=k=>[...document.querySelectorAll(`.board[data-board="${k}"] > .panel`)];
function groups(){ return BOARDS.map(([k,emo,label])=>({key:k,label,emoji:emo,href:"#"+k,
  subs:panels(k).map((p,i)=>({p,i,t:titleOf(p)})).filter(x=>x.t&&!x.p.classList.contains("photo-card")).slice(0,12).map(x=>({href:`#${k}/${x.i}`,emoji:detailOf(k,x.p)?"📖":"✦",label:x.t.length>34?x.t.slice(0,32)+"…":x.t}))})); }
const host=document.getElementById("sama-nav");
const draw=()=>{ const h=(document.body.dataset.page||(location.hash||"#home").slice(1).split("/")[0]); mountNav(host,{groups:groups(),active:h==="overview"?(location.hash.slice(1).split("/")[0]):h,brandHref:"#home",account:{label:"Login",emoji:"🔑",href:"https://sama-studios.web.app/login"}}); };
// Only panels with real extra detail open a page (Jobs → full role history). Everything else is a plain card.
const DETAIL={"professional":{"Jobs":"detail-jobs"}};
const detailOf=(k,p)=>(DETAIL[k]||{})[titleOf(p)];
BOARDS.forEach(([k])=>panels(k).forEach((p,i)=>{ if(!detailOf(k,p)) return; p.classList.add("clicky"); p.tabIndex=0; p.setAttribute("role","link"); p.setAttribute("aria-label","Open "+titleOf(p)+" details");
  const go=()=>{location.hash=`#${k}/${i}`;}; p.addEventListener("click",ev=>{ if(ev.target.closest("a,button,input,[data-open],.sphere,.chart svg")) return; go(); });
  p.addEventListener("keydown",ev=>{ if(ev.key==="Enter"&&ev.target===p){ev.preventDefault();go();} }); }));
// overview board (detail pages only); other panel links just scroll to the card on its board
window.samaOverview=function(key){ const [k,i]=key.split("/"); const src=panels(k)[+i]; const ov=document.getElementById("b-overview"); if(!src||!ov) return false;
  const tid=detailOf(k,src); if(!tid) return false; const tpl=document.getElementById(tid);
  const label=(BOARDS.find(b=>b[0]===k)||[])[2]||k; const back=document.createElement("a"); back.className="ov-back"; back.href="#"+k; back.textContent="← "+label;
  const head=document.createElement("section"); head.className="glass panel s12 ov-head"; const eb=document.createElement("p"); eb.className="eyebrow"; eb.textContent=label; const h1=document.createElement("h1"); h1.textContent=titleOf(src); head.append(back,eb,h1);
  const body=document.createElement("section"); body.className="s12 ov-detail"; body.append(tpl.content.cloneNode(true));
  ov.replaceChildren(head,body); ov.dataset.title=titleOf(src)+" · "+label; return true; };
window.samaScrollTo=function(k,i){ const p=panels(k)[+i]; if(!p) return; p.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"}); p.classList.remove("flash"); void p.offsetWidth; p.classList.add("flash"); };
// greeting (the only clock is the one in the top bar)
const hg=document.getElementById("home-greet"); const tick=()=>{ if(hg) hg.textContent=greeting(new Date()); }; tick(); setInterval(tick,60000);
draw(); addEventListener("hashchange",draw); document.addEventListener("sama:board",draw);
const y=document.getElementById("year"); if(y) y.textContent=new Date().getFullYear();
if(location.hash.includes("/")&&window.samaShow) window.samaShow(location.hash.slice(1),false);
