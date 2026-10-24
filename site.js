// Public site: shared Sama nav + landing clock/greeting + clickable panels -> overview pages. Public content only.
import { mountNav, greeting } from "./sama-nav.js?v=7";
const BOARDS=[["home","🏯","Home"],["professional","💼","Professional"],["academic","📚","Academic"],["personal","🌸","Personal & Social"],["resume","📄","Résumé"]];
const titleOf=p=>{const h=p.querySelector("h1,h3,.slabel,h2"); return h?h.textContent.trim().replace(/\s+/g," "):"";};
const panels=k=>[...document.querySelectorAll(`.board[data-board="${k}"] > .panel`)];
function groups(){ return BOARDS.map(([k,emo,label])=>({key:k,label,emoji:emo,href:"#"+k,
  subs:k==="home"?[]:panels(k).map((p,i)=>({p,i,t:titleOf(p)})).filter(x=>x.t&&!x.p.classList.contains("photo-card")).slice(0,12).map(x=>({href:`#${k}/${x.i}`,emoji:"✦",label:x.t.length>34?x.t.slice(0,32)+"…":x.t}))})); }
const host=document.getElementById("sama-nav");
const draw=()=>{ const h=(location.hash||"#home").slice(1).split("/")[0]; mountNav(host,{groups:groups(),active:h==="overview"?"":h,brandHref:"#home",account:{label:"Login",emoji:"🔑",href:"https://sama-studios.web.app/login"}}); };
// clickable panels
BOARDS.slice(1).forEach(([k])=>panels(k).forEach((p,i)=>{ if(p.classList.contains("photo-card")) return; p.classList.add("clicky"); p.tabIndex=0; p.setAttribute("role","link"); p.setAttribute("aria-label","Open "+(titleOf(p)||"panel"));
  const go=()=>{location.hash=`#${k}/${i}`;}; p.addEventListener("click",ev=>{ if(ev.target.closest("a,button,input,[data-open],.sphere,.chart svg")) return; go(); });
  p.addEventListener("keydown",ev=>{ if(ev.key==="Enter"&&ev.target===p){ev.preventDefault();go();} }); }));
// overview board
window.samaOverview=function(key){ const [k,i]=key.split("/"); const src=panels(k)[+i]; const ov=document.getElementById("b-overview"); if(!src||!ov) return false;
  const label=(BOARDS.find(b=>b[0]===k)||[])[2]||k; const back=document.createElement("a"); back.className="ov-back"; back.href="#"+k; back.textContent="← "+label;
  const head=document.createElement("section"); head.className="glass panel s12 ov-head"; const eb=document.createElement("p"); eb.className="eyebrow"; eb.textContent=label+" · Overview"; const h1=document.createElement("h1"); h1.textContent=titleOf(src)||label; head.append(back,eb,h1);
  const clone=src.cloneNode(true); clone.classList.remove("s3","s4","s5","s6","s7","s8","r2","clicky","rise"); clone.classList.add("s12","ov-body"); clone.removeAttribute("role"); clone.removeAttribute("tabindex"); clone.removeAttribute("aria-label");
  ov.replaceChildren(head,clone); ov.dataset.title=(titleOf(src)||label)+" · "+label; document.dispatchEvent(new CustomEvent("sama:overview")); return true; };
// landing clock
const hd=document.getElementById("home-date"), ht=document.getElementById("home-time"), hg=document.getElementById("home-greet");
const tick=()=>{const d=new Date(); if(hd) hd.textContent=d.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"}); if(ht){ht.textContent=d.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit",second:"2-digit"}); ht.dateTime=d.toISOString();} if(hg) hg.textContent=greeting(d);};
tick(); setInterval(tick,1000);
draw(); addEventListener("hashchange",draw);
const y=document.getElementById("year"); if(y) y.textContent=new Date().getFullYear();
if(location.hash.includes("/")&&window.samaShow) window.samaShow(location.hash.slice(1),false);
