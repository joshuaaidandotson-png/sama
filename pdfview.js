// Renders the real résumé PDF as canvases (PDF.js from a free CDN). Falls back to <object> if it fails.
const URL_PDF = "assets/Joshua_Dotson_Resume.pdf";
const box = document.getElementById("pdf");
// crop the white page margins so the résumé fills the panel
function trim(c, i, n) {
  // same crop for every page (the PDF's 0.5in/0.55in margins minus a little breathing room)
  const sx = c.width / 612, x0 = Math.round(30 * sx), y0 = Math.round(26 * sx), w = c.width - 2 * x0, h = c.height - 2 * y0;
  const o = document.createElement("canvas"); o.width = w; o.height = h;
  o.getContext("2d").drawImage(c, x0, y0, w, h, 0, 0, w, h);
  o.setAttribute("role", "img"); o.setAttribute("aria-label", `Résumé page ${i} of ${n}`); return o;
}
try {
  const pdfjs = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
  const doc = await pdfjs.getDocument(URL_PDF).promise;
  const frag = document.createDocumentFragment();
  const scale = Math.min(2.5, (window.devicePixelRatio || 1) * 1.6);
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i), vp = page.getViewport({ scale });
    const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
    c.setAttribute("aria-label", `Résumé page ${i} of ${doc.numPages}`); c.setAttribute("role", "img");
    await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    frag.appendChild(trim(c, i, doc.numPages));
  }
  box.replaceChildren(frag); box.dataset.rendered = doc.numPages;
} catch (e) { console.warn("PDF.js failed, using embedded PDF", e); }
