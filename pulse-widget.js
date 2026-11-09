/* Lecture Pulse widget: shows the two dials small in a corner of an HTML slide deck.
   Add ONE line just before </body> of the presenter version of a deck:

   <script src="https://YOUR-HOST/pulse-widget.js" data-room="bio144" data-key="g"></script>

   Options (all optional):
     data-room     room name (default: bio144)
     data-key      key that shows/hides the dials (default: g)
     data-width    widget width in px (default: 300)
     data-corner   top-right | top-left | bottom-right | bottom-left (default: top-right)
     data-hidden   "true" to start hidden
     data-src      URL of present.html (default: next to this script)
*/
(function () {
  const s = document.currentScript, d = s.dataset;
  const src = new URL(d.src || "present.html", s.src);
  src.searchParams.set("mini", ""); src.searchParams.set("r", d.room || "bio144");
  const w = +(d.width || 300), corner = (d.corner || "top-right").split("-");
  const f = document.createElement("iframe");
  f.src = src.href.replace("mini=", "mini"); f.title = "Lecture Pulse";
  f.setAttribute("allowtransparency", "true");
  Object.assign(f.style, {
    position: "fixed", [corner[0]]: "10px", [corner[1]]: "10px", width: w + "px", height: Math.round(w * 0.4) + "px",
    border: "0", background: "transparent", zIndex: 2147483000, pointerEvents: "none", colorScheme: "normal",
  });
  let hidden = d.hidden === "true";
  try { const v = localStorage.getItem("pulse-widget-hidden"); if (v !== null) hidden = v === "1"; } catch (e) {}
  const show = () => { f.style.display = hidden ? "none" : "block"; };
  show();
  document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() !== (d.key || "g") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable) return;
    hidden = !hidden; show();
    try { localStorage.setItem("pulse-widget-hidden", hidden ? "1" : "0"); } catch (e) {}
  });
  (document.body ? Promise.resolve() : new Promise(r => addEventListener("DOMContentLoaded", r)))
    .then(() => document.body.appendChild(f));
})();
