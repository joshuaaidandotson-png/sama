/* Sama tight-pack (Oct 24 5:50 AM request): different card sizes, one uniform gap, no holes.
   Skyline packing on the 12-column grid: each card keeps its width (span) and content height,
   and goes where it sits highest with the least wasted space; small leftover holes are closed by
   extending the card above. Phone (one column) uses the normal CSS gap. */
(function(){
  function packGrid(g,gap,minW){
    var kids=Array.prototype.filter.call(g.children,function(e){return !e.hidden&&getComputedStyle(e).display!=="none"&&getComputedStyle(e).position!=="absolute";});
    var on=window.innerWidth>=minW;
    g.classList.toggle("masonry",on);g.classList.toggle("packed",on);
    kids.forEach(function(e){e.style.gridColumn="";e.style.gridRow="";e.style.gridRowEnd="";e.classList.remove("pfill","stretched");e.style.alignSelf="";});
    if(!on||!kids.length)return;
    var W=g.clientWidth-parseFloat(getComputedStyle(g).paddingLeft||0)-parseFloat(getComputedStyle(g).paddingRight||0);
    var colW=(W-11*gap)/12,G=Math.round(gap/2),bot=[0,0,0,0,0,0,0,0,0,0,0,0],P=[];
    var tail=kids.filter(function(e){return e.classList.contains("soc-foot");});kids=kids.filter(function(e){return tail.indexOf(e)<0;});
    var Q=kids.map(function(e){
      var cs=getComputedStyle(e),ce=cs.gridColumnEnd,cst=cs.gridColumnStart,w;
      if(/^span \d+/.test(ce))w=parseInt(ce.slice(5),10);else if(/^span \d+/.test(cst))w=parseInt(cst.slice(5),10);else if(ce==="-1")w=12;
      else w=Math.round((e.getBoundingClientRect().width+gap)/(colW+gap));
      return {e:e,w:Math.max(1,Math.min(12,w||12)),h:Math.max(1,Math.ceil(e.getBoundingClientRect().height/2))};
    });
    function spot(it){var best=null;for(var c=0;c+it.w<=12;c++){var t=0,i;for(i=c;i<c+it.w;i++)t=Math.max(t,bot[i]);var waste=0;for(i=c;i<c+it.w;i++)waste+=t-bot[i];var sc=t+waste*0.6/it.w;if(!best||sc<best.sc-0.01)best={c:c,t:t,sc:sc,waste:waste};}return best;}
    while(Q.length){
      var k=0,b0=spot(Q[0]);
      if(b0.waste>0){ /* pull a later, narrower card forward if it can sit higher (fills the low columns first) */
        for(var q=1;q<Math.min(Q.length,8);q++){if(Q[q].w>=Q[0].w)continue;var bq=spot(Q[q]);if(bq.t<b0.t&&bq.t+Q[q].h+G<=b0.t+Q[q].h){k=q;break;}}
      }
      var it=Q.splice(k,1)[0],best=spot(it);
      for(var j=best.c;j<best.c+it.w;j++)bot[j]=best.t+it.h+G;
      P.push({e:it.e,c:best.c,w:it.w,t:best.t,h:it.h});
    }
    var maxB=Math.max.apply(null,P.map(function(p){return p.t+p.h;}));
    P.forEach(function(p){
      var tgt=null;
      P.forEach(function(o){if(o!==p&&o.t>=p.t+p.h&&o.c<p.c+p.w&&o.c+o.w>p.c){var b=o.t-G;if(tgt===null||b<tgt)tgt=b;}});
      if(tgt===null)tgt=(maxB-(p.t+p.h)<=70)?maxB:p.t+p.h; /* even the bottom edge when close */
      if(tgt-(p.t+p.h)>0){p.h=tgt-p.t;p.e.classList.add("pfill");}
    });
    tail.forEach(function(e){e.style.gridColumn="1 / -1";e.style.gridRow=(maxB+G+1)+" / span "+Math.max(1,Math.ceil(e.getBoundingClientRect().height/2));});
    P.forEach(function(p){p.e.style.gridColumn=(p.c+1)+" / span "+p.w;p.e.style.gridRow=(p.t+1)+" / span "+p.h;});
  }
  function packAll(){
    document.querySelectorAll(".dash,.wgrid").forEach(function(g){
      if(g.offsetParent===null)return;
      packGrid(g,16,g.classList.contains("dash")?1001:861);
    });
  }
  var t;function later(){clearTimeout(t);t=setTimeout(packAll,50);}
  window.samaPack=packAll;
  addEventListener("load",later);addEventListener("resize",later);document.addEventListener("sama:board",later);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(later);
  document.addEventListener("load",function(e){if(e.target&&e.target.tagName==="IMG")later();},true);
  new MutationObserver(later).observe(document.body,{childList:true,subtree:true});
  later();setTimeout(packAll,900);setTimeout(packAll,2200);
})();
