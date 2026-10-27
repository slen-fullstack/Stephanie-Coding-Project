// Constellation intro: stars for each role appear in order, get joined by
// glowing lines, then a sunrise sweeps up and washes the night away.
(function () {
  var root = document.documentElement;
  var intro = document.getElementById("cintro");
  if (!intro || !root.classList.contains("intro")) {
    if (intro) intro.remove();
    root.classList.remove("intro"); // no stars set up: just show the page
    root.classList.add("intro-seen");
    return;
  }

  var stars;
  try { stars = JSON.parse(intro.dataset.stars || "[]"); } catch (e) { stars = []; }
  var map = document.getElementById("cintro-map");
  var svg = document.getElementById("cintro-lines");
  var title = document.getElementById("cintro-title");
  var canvas = document.getElementById("cintro-sky");
  var ctx = canvas.getContext("2d");
  var NS = "http://www.w3.org/2000/svg";
  var DESK_Y = [62, 34, 56, 26, 60, 36, 64, 22, 58, 30]; // zigzag heights (% of screen)
  var nodes = [], lines = [], timers = [], dots = [], raf, finished = false;
  var mobile = innerWidth < 700;

  // ── lay out the stars ──
  var n = stars.length;
  var pts = stars.map(function (s, i) {
    if (mobile) return [innerWidth * (i % 2 ? 0.72 : 0.24), innerHeight * (0.12 + (n > 1 ? i / (n - 1) : 0) * 0.62)];
    return [innerWidth * (0.09 + (n > 1 ? i / (n - 1) : 0) * 0.83), innerHeight * (0.04 + DESK_Y[i % DESK_Y.length] / 100 * 0.92)];
  });
  stars.forEach(function (s, i) {
    var node = document.createElement("div");
    node.className = "cnode";
    var prevY = i ? pts[i - 1][1] : pts[i][1] + 1, nextY = i < n - 1 ? pts[i + 1][1] : pts[i][1] + 1;
    if (!mobile && pts[i][1] < prevY && pts[i][1] < nextY) node.classList.add("up"); // label above peaks
    node.style.setProperty("--x", pts[i][0] + "px");
    node.style.setProperty("--y", pts[i][1] + "px");
    var dot = document.createElement("span"); dot.className = "dot";
    var label = document.createElement("span"); label.className = "label";
    var b = document.createElement("b"); b.textContent = s.role || "";
    var w = document.createElement("span"); w.textContent = s.where || "";
    label.appendChild(b); label.appendChild(w);
    node.appendChild(dot); node.appendChild(label);
    map.appendChild(node); nodes.push(node);
    if (i) {
      var l = document.createElementNS(NS, "line");
      l.setAttribute("x1", pts[i - 1][0]); l.setAttribute("y1", pts[i - 1][1]);
      l.setAttribute("x2", pts[i][0]); l.setAttribute("y2", pts[i][1]);
      l.style.setProperty("--len", Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]).toFixed(1));
      svg.appendChild(l); lines.push(l);
    }
  });

  // ── twinkling background ──
  var dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  for (var i = 0; i < innerWidth * innerHeight / 4000; i++) {
    dots.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.3 + 0.3, p: Math.random() * 6.3, s: Math.random() * 0.03 + 0.01 });
  }
  function drawSky() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    dots.forEach(function (d) {
      d.p += d.s;
      ctx.globalAlpha = 0.3 + 0.6 * Math.abs(Math.sin(d.p));
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.3); ctx.fill();
    });
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(drawSky);
  }

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  // ── sunrise: dawn rises from the bottom and reveals the page ──
  var sun = document.getElementById("cintro-sun"), sunRaf;
  function setP(p, g) {
    intro.style.setProperty("--p", p.toFixed(4));
    if (sun) { sun.style.setProperty("--p", p.toFixed(4)); sun.style.setProperty("--glow", g.toFixed(3)); }
  }
  function sunrise() {
    intro.classList.add("leave");
    var t0 = performance.now(), DUR = 1900;
    (function step(now) {
      var k = Math.min((now - t0) / DUR, 1);
      var p = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; // ease in-out
      var g = k < 0.12 ? k / 0.12 : k > 0.8 ? (1 - k) / 0.2 : 1;      // fade the glow in and out
      setP(p, g);
      if (k < 1) sunRaf = requestAnimationFrame(step); else finish();
    })(t0);
  }

  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    cancelAnimationFrame(sunRaf);
    setP(1, 0);
    intro.classList.add("done");
    root.classList.remove("intro");
    root.classList.add("intro-seen");
    document.dispatchEvent(new Event("intro:done"));
    setTimeout(function () { cancelAnimationFrame(raf); intro.remove(); if (sun) sun.remove(); }, 300);
  }

  // ── timeline ──
  var STEP = 420;
  nodes.forEach(function (node, i) {
    later(function () {
      if (i) lines[i - 1].classList.add("on");
      later(function () { node.classList.add("on"); }, i ? 220 : 0);
    }, 300 + i * STEP);
  });
  var end = 300 + n * STEP + 250;
  later(function () { title.classList.add("on"); }, end);
  later(sunrise, end + 1300);

  document.getElementById("cintro-skip").addEventListener("click", finish);
  drawSky();
})();
