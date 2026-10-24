/* Sama tight-pack (Oct 24 5:50 AM request): different card sizes, one uniform gap, no holes.
   Skyline packing on the 12-column grid: each card keeps its width (span) and content height,
   and goes where it sits highest with the least wasted space; small leftover holes are closed by
   extending the card above. Phone (one column) uses the normal CSS gap. */
(function(){
  function packGrid(g,gap,minW){
    var kids=Array.prototype.filter.call(g.children,function(e){return !e.hidden&&getComputedStyle(e).display!=="none"&&getComputedStyle(e).position!=="absolute";});
    var on=window.innerWidth>=minW;
    /* scroll_fix_1024: keep the grid's current height while it is re-measured. Resetting the row spans collapses the
       grid for one layout pass, the page gets shorter than scrollY, and the browser snaps the page back to the top. */
    var sy=window.scrollY,sx=window.scrollX;g.style.minHeight=g.offsetHeight+"px";
    g.classList.toggle("masonry",on);g.classList.toggle("packed",on);
    kids.forEach(function(e){e.style.gridColumn="";e.style.gridRow="";e.style.gridRowEnd="";e.classList.remove("pk-fill","stretched");e.style.alignSelf="";});
    if(!on||!kids.length){g.style.minHeight="";return;}
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
    /* dev_20261024: 2-step lookahead. Among the next few cards, place the one whose spot (plus the best follow-up)
       leaves the least empty area under it; ties keep page order. Stops the "narrow card first, hole later" gaps. */
    function wasteAt(b,it){var best=null;for(var c=0;c+it.w<=12;c++){var t=0,i;for(i=c;i<c+it.w;i++)t=Math.max(t,b[i]);var w=0;for(i=c;i<c+it.w;i++)w+=t-b[i];if(!best||w<best.w-0.5||(Math.abs(w-best.w)<=0.5&&t<best.t))best={c:c,t:t,w:w};}return best;}
    function put(b,it,sp){var nb=b.slice();for(var j=sp.c;j<sp.c+it.w;j++)nb[j]=sp.t+it.h+G;return nb;}
    while(Q.length){
      var L=Math.min(Q.length,4),pick=0,pickSc=null,pickSp=null;
      for(var i1=0;i1<L;i1++){var s1=wasteAt(bot,Q[i1]),sc=s1.w*colW;
        if(L>1){var nb=put(bot,Q[i1],s1),m=null;for(var i2=0;i2<L;i2++){if(i2===i1)continue;var s2=wasteAt(nb,Q[i2]);if(m===null||s2.w<m)m=s2.w;}sc+=m*colW*0.8;}
        sc+=i1*4+s1.t*0.02;
        if(pickSc===null||sc<pickSc){pickSc=sc;pick=i1;pickSp=s1;}}
      var it=Q.splice(pick,1)[0],best=pickSp;
      for(var j=best.c;j<best.c+it.w;j++)bot[j]=best.t+it.h+G;
      P.push({e:it.e,c:best.c,w:it.w,t:best.t,h:it.h});
    }
    /* widen a card sideways into empty columns when the whole strip beside it is free */
    function freeCol(c,t,b,me){return P.every(function(o){return o===me||c<o.c||c>=o.c+o.w||o.t+o.h+G<=t||o.t>=b+G;});}
    P.forEach(function(p){while(p.c+p.w<12&&freeCol(p.c+p.w,p.t,p.t+p.h,p))p.w++;while(p.c>0&&freeCol(p.c-1,p.t,p.t+p.h,p)){p.c--;p.w++;}});
    var maxB=Math.max.apply(null,P.map(function(p){return p.t+p.h;}));
    P.forEach(function(p){
      var tgt=null;
      P.forEach(function(o){if(o!==p&&o.t>=p.t+p.h&&o.c<p.c+p.w&&o.c+o.w>p.c){var b=o.t-G;if(tgt===null||b<tgt)tgt=b;}});
      if(tgt===null)tgt=(maxB-(p.t+p.h)<=70)?maxB:p.t+p.h; /* even the bottom edge when close */
      if(tgt-(p.t+p.h)>0){p.h=tgt-p.t;p.e.classList.add("pk-fill");}
    });
    tail.forEach(function(e){e.style.gridColumn="1 / -1";e.style.gridRow=(maxB+G+1)+" / span "+Math.max(1,Math.ceil(e.getBoundingClientRect().height/2));});
    P.forEach(function(p){p.e.style.gridColumn=(p.c+1)+" / span "+p.w;p.e.style.gridRow=(p.t+1)+" / span "+p.h;});
    g.style.minHeight="";if(window.scrollY!==sy)window.scrollTo(sx,sy);
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
  /* scroll_fix_1024: only repack when panels are added/removed or a board/grid changes, not on every text tick (the
     countdown rewrites its digits every second, which used to repack the board and jump the page to the top).
     Content that changes height is caught by the ResizeObserver below. */
  function relevant(rs){for(var i=0;i<rs.length;i++){var t=rs[i].target;if(t.nodeType===1&&(t.matches(".dash,.wgrid,.board,main,body")))return true;}return false;}
  new MutationObserver(function(rs){if(relevant(rs))later();}).observe(document.body,{childList:true,subtree:true});
  if(window.ResizeObserver){var seen=new WeakSet(),hs=new WeakMap(),ro=new ResizeObserver(function(es){var ch=false;es.forEach(function(en){var h=Math.round(en.contentRect.height),o=hs.get(en.target);if(o!==undefined&&Math.abs(o-h)>1)ch=true;hs.set(en.target,h);});if(ch)later();});
    setInterval(function(){document.querySelectorAll(".wgrid>*>*,.dash>*>*").forEach(function(c){if(!seen.has(c)){seen.add(c);ro.observe(c);}});},1000);}
  later();setTimeout(packAll,900);setTimeout(packAll,2200);
})();
