// Sama Studios (public) service worker, scope /sama/: network first, cached copy when offline.
const CACHE="sama-pub-v17";
const SHELL=["./","index.html","style.css","public-v7.css","sama-nav.css","sama-nav.js","site.js","script.js","pack.js","manifest.webmanifest","assets/icon-192.png","assets/icon-512.png","assets/apple-touch-icon.png","assets/favicon.svg","assets/favicon-32.png","assets/favicon-16.png"];
self.addEventListener("install",ev=>{ev.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).catch(()=>{}));self.skipWaiting();});
self.addEventListener("activate",ev=>{ev.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("sama-pub-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",ev=>{const u=new URL(ev.request.url);
  if(ev.request.method!=="GET"||u.origin!==location.origin||!u.pathname.startsWith("/sama/")) return;
  ev.respondWith(fetch(ev.request).then(r=>{if(r.ok&&r.type==="basic"){const c=r.clone();caches.open(CACHE).then(x=>x.put(ev.request,c));}return r;})
    .catch(()=>caches.match(ev.request,{ignoreSearch:true}).then(m=>m||(ev.request.mode==="navigate"?caches.match("index.html"):m))));});
