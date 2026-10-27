// Work Portfolio page: thumbnail switching and a photo lightbox.
(function () {
  // ── Thumbnails swap the big photo ──
  document.querySelectorAll("[data-gallery]").forEach(function (g) {
    var main = g.querySelector(".photo-main img");
    var thumbs = g.querySelectorAll(".thumb");
    thumbs.forEach(function (t) {
      t.addEventListener("click", function () {
        thumbs.forEach(function (x) { x.classList.toggle("on", x === t); });
        main.style.opacity = 0;
        setTimeout(function () { main.src = t.dataset.src; main.style.opacity = 1; }, 180);
      });
    });
  });

  // ── Lightbox ──
  var box = document.getElementById("lightbox");
  if (!box) return;
  var img = box.querySelector("img");
  var list = [], index = 0, lastFocus = null;

  function show(i) {
    index = (i + list.length) % list.length;
    img.src = list[index];
    box.querySelector(".lb-prev").hidden = box.querySelector(".lb-next").hidden = list.length < 2;
  }
  function open(srcs, i) {
    list = srcs; lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    document.documentElement.style.overflow = "hidden";
    box.querySelector(".lb-close").focus();
  }
  function close() {
    box.hidden = true;
    document.documentElement.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  // a frame's big photo opens that frame's photos
  document.querySelectorAll("[data-gallery]").forEach(function (g) {
    g.querySelector(".photo-main").addEventListener("click", function () {
      var thumbs = g.querySelectorAll(".thumb");
      if (!thumbs.length) return open([g.querySelector(".photo-main img").src], 0);
      var srcs = Array.prototype.map.call(thumbs, function (t) { return t.dataset.src; });
      var current = Array.prototype.findIndex.call(thumbs, function (t) { return t.classList.contains("on"); });
      open(srcs, Math.max(current, 0));
    });
  });

  // snapshots open as one album; the certificate on its own
  var snaps = Array.prototype.slice.call(document.querySelectorAll(".snap"));
  var snapSrcs = snaps.map(function (s) { return s.dataset.zoom; });
  snaps.forEach(function (s, i) { s.addEventListener("click", function () { open(snapSrcs, i); }); });
  document.querySelectorAll(".cert-frame").forEach(function (c) {
    c.addEventListener("click", function () { open([c.dataset.zoom], 0); });
  });

  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
  box.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();
