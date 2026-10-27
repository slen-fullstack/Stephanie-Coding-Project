// Supernova loading screen: a star charges up while the page loads,
// bursts into a blue core with shooting stars, then reveals the site.
(function () {
  var root = document.documentElement;
  var loader = document.getElementById("loader");
  if (!loader || !root.classList.contains("intro")) {
    if (loader) loader.remove();
    return;
  }

  var NS = "http://www.w3.org/2000/svg";
  var MIN_CHARGE = 3;   // seconds the star charges before it can burst
  var MAX_WAIT = 8;     // never hold visitors longer than this
  var t0 = performance.now();
  var loaded = document.readyState === "complete";
  var bursting = false, finished = false;
  addEventListener("load", function () { loaded = true; });

  function make(tag, attrs, parent) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    parent.appendChild(el);
    return el;
  }

  // ── The charging star ──
  var aura = document.getElementById("loader-aura");
  var starBody = document.getElementById("loader-starbody");
  var rays = document.getElementById("loader-rays");
  for (var r = 0; r < 12; r++) {
    make("path", { d: "M-3 -70 L0 -135 L3 -70Z", fill: "#ffe9a8", transform: "rotate(" + r * 30 + ")" }, rays);
  }
  var sparkLayer = document.getElementById("loader-sparks");
  var colors = ["#ffc94a", "#5fe3c0", "#ff8a4c", "#fff3c4", "#5fe3c0", "#ffc94a", "#ff8a4c"];
  var sparks = colors.map(function (c, i) {
    return { el: make("use", { href: "#loader-spark", fill: c }, sparkLayer), a: i / colors.length * Math.PI * 2, r: 88 + (i % 3) * 14, v: 0.9 + (i % 4) * 0.25, s: 0.7 + (i % 3) * 0.3 };
  });

  function drawStar(t) {
    var e = Math.pow(Math.min(t / MIN_CHARGE, 1), 2);
    var beat = Math.sin(t * (4 + e * 14)); // pulses faster as it charges
    var scale = 0.85 + e * 0.25 + beat * (0.03 + e * 0.05);
    starBody.setAttribute("transform", "rotate(" + (Math.sin(t * 1.5) * 6).toFixed(2) + ") scale(" + scale.toFixed(3) + ")");
    aura.setAttribute("r", (95 + e * 55 + beat * 8).toFixed(1));
    aura.setAttribute("opacity", (0.55 + e * 0.45).toFixed(2));
    rays.setAttribute("transform", "rotate(" + (t * 12).toFixed(1) + ") scale(" + (0.8 + e * 0.5 + beat * 0.04).toFixed(3) + ")");
    rays.setAttribute("opacity", (0.2 + e * 0.6).toFixed(2));
    sparks.forEach(function (sp) {
      var ang = sp.a + t * sp.v * (1 + e * 2.5);
      var rad = sp.r * (1 - e * 0.35); // sparks get pulled in
      var tw = 0.6 + 0.4 * Math.sin(t * 5 + sp.a * 3);
      sp.el.setAttribute("transform", "translate(" + (Math.cos(ang) * rad).toFixed(1) + " " + (Math.sin(ang) * rad).toFixed(1) + ") rotate(" + (t * 90).toFixed(0) + ") scale(" + (sp.s * tw).toFixed(2) + ")");
    });
  }

  // ── Rotating messages ──
  var msgEl = document.getElementById("loader-text");
  var messages;
  try { messages = JSON.parse(loader.dataset.messages || "[]"); } catch (err) { messages = []; }
  var m = 0;
  var msgTimer = messages.length > 1 && setInterval(function () {
    m = (m + 1) % messages.length;
    msgEl.textContent = messages[m];
    msgEl.style.animation = "none"; void msgEl.offsetWidth; msgEl.style.animation = "";
  }, 1100);

  // ── Warp-speed shooting stars ──
  var canvas = document.getElementById("loader-warp");
  var ctx = canvas.getContext("2d");
  var stars = [], warping = false, warpStart = 0;
  function sizeCanvas() {
    var dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    loader.style.setProperty("--cover", (Math.hypot(innerWidth, innerHeight) / 30 * 1.15).toFixed(1));
  }
  function drawWarp(now) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (!warping) return;
    var cx = innerWidth / 2, cy = innerHeight / 2;
    var speed = 1 + Math.min((now - warpStart) / 1600, 1) * 9;
    stars.forEach(function (s) {
      var d0 = s.d;
      s.d += s.v * speed;
      var len = Math.min(s.d - d0, 160) * 3;
      var x1 = cx + Math.cos(s.a) * s.d, y1 = cy + Math.sin(s.a) * s.d;
      var back = Math.max(s.d - len, 0);
      var x0 = cx + Math.cos(s.a) * back, y0 = cy + Math.sin(s.a) * back;
      var g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, "rgba(" + s.hue + ",0)");
      g.addColorStop(1, "rgba(" + s.hue + ",.95)");
      ctx.strokeStyle = g; ctx.lineWidth = s.w;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      if (s.d > Math.hypot(cx, cy) + 50) { s.d = Math.random() * 30; s.a = Math.random() * Math.PI * 2; }
    });
  }

  // ── Timeline ──
  function burst() {
    if (bursting) return;
    bursting = true;
    clearInterval(msgTimer);
    loader.classList.add("burst");
    setTimeout(function () {
      for (var i = 0; i < 220; i++) {
        stars.push({ a: Math.random() * Math.PI * 2, d: Math.random() * 40, v: 2 + Math.random() * 6, w: Math.random() * 1.8 + 0.6, hue: Math.random() < 0.2 ? "255,201,74" : Math.random() < 0.2 ? "95,227,192" : "255,255,255" });
      }
      warping = true; warpStart = performance.now();
    }, 230);
    setTimeout(finish, 1900);
  }

  function finish() {
    if (finished) return;
    finished = true;
    loader.classList.add("done");
    root.classList.remove("intro");
    root.classList.add("intro-seen");
    try { sessionStorage.setItem("seenIntro", "1"); } catch (err) {}
    document.dispatchEvent(new Event("intro:done"));
    setTimeout(function () { warping = false; loader.remove(); }, 1000);
  }

  function loop(now) {
    if (!loader.isConnected) return;
    var t = (now - t0) / 1000;
    if (!bursting) drawStar(t);
    if (!bursting && ((t >= MIN_CHARGE && loaded) || t >= MAX_WAIT)) burst();
    drawWarp(now);
    requestAnimationFrame(loop);
  }

  document.getElementById("loader-skip").addEventListener("click", finish);
  sizeCanvas();
  addEventListener("resize", sizeCanvas);
  requestAnimationFrame(loop);
})();
