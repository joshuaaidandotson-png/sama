// Public site: shared Sama nav + landing clock/greeting + clickable panels -> overview pages. Public content only.
import { mountNav, greeting } from "./sama-nav.js?v=16";
const BOARDS=[["professional","💼","Professional"],["academic","📚","Academic"],["personal","🌸","Social"],["resume","📄","Résumé"]];
const titleOf=p=>{const h=p.querySelector("h1,h3,.slabel,h2"); return h?h.textContent.trim().replace(/\s+/g," "):"";};
const panels=k=>[...document.querySelectorAll(`.board[data-board="${k}"] > .panel`)];
function groups(){ return BOARDS.map(([k,emo,label])=>({key:k,label,emoji:emo,href:"#"+k})); }
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
// Stickers like the private side: one unique sticker per card title (no repeats on a board) + social stickers footer on every board.
const WSTK_PUB={professional:{"Jobs":"briefcase","Internships":"handshake","Skills":"hammer_and_wrench","Projects":"light_bulb","Awards":"trophy","Certifications":"scroll"},
 academic:{"Educational Institutions":"school","Current classes":"books","What I’m studying & why":"brain","What I'm studying & why":"brain","Awards":"military_medal","Organizations":"card_index_dividers","Goals":"bullseye"},
 personal:{"Short bio":"memo","Song":"next_track_button","Interests":"star","Top games":"video_game","Hobbies":"artist_palette","Social links":"megaphone","Christianity":"bust_in_silhouette"}};
document.querySelectorAll('.board[data-board]').forEach(b=>{ const M=WSTK_PUB[b.dataset.board]||{}; const used=new Set();
  b.querySelectorAll("h3").forEach(h=>{ const ic=h.querySelector("svg.ic"); if(!ic) return; const k=M[h.textContent.trim()]; if(!k||used.has(k)) return; used.add(k);
    const im=document.createElement("img"); im.className="stk w-stk"; im.src="assets/stickers/w_"+k+".webp"; im.alt=""; im.width=34; im.height=34; ic.replaceWith(im); h.classList.add("w-h3"); });
  if(b.dataset.board!=="overview"&&!b.querySelector(".soc-foot")){ const src=document.querySelector("#b-home .ha-btns")||document.querySelector(".soc-stks"); if(src){ const f=document.createElement("footer"); f.className="soc-foot s12"; const t=document.createElement("span"); t.className="soc-foot-t"; t.textContent="✦ Joshua-Sama · Christ Luvr ✦"; f.append(t,src.cloneNode(true)); b.append(f); } } });
