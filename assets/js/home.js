// Homepage animations: starfield, count-up numbers, scroll reveal,
// flipping clouds, endorsement bubbles and the string of lights.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Twinkling starfield with the odd shooting star ──
  var canvas = document.getElementById("sky");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    var shooting = null;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round((innerWidth * innerHeight) / 5000);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          r: Math.random() * 1.4 + 0.3,
          p: Math.random() * Math.PI * 2,
          s: Math.random() * 0.02 + 0.005
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        st.p += st.s;
        ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(st.p));
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!shooting && Math.random() < 0.004) {
        shooting = { x: Math.random() * innerWidth * 0.7 + innerWidth * 0.2, y: Math.random() * innerHeight * 0.4, life: 1 };
      }
      if (shooting) {
        var len = 120;
        var grad = ctx.createLinearGradient(shooting.x, shooting.y, shooting.x + len, shooting.y - len * 0.45);
        grad.addColorStop(0, "rgba(255,240,200," + shooting.life + ")");
        grad.addColorStop(1, "rgba(255,240,200,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shooting.x, shooting.y);
        ctx.lineTo(shooting.x + len, shooting.y - len * 0.45);
        ctx.stroke();
        shooting.x -= 9;
        shooting.y += 4;
        shooting.life -= 0.02;
        if (shooting.life <= 0) shooting = null;
      }
      ctx.globalAlpha = 1;
      if (!reduce) requestAnimationFrame(draw);
    }

    resize();
    addEventListener("resize", resize);
    draw();
  }

  // ── Count-up numbers ──
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    if (reduce || isNaN(target)) return;
    var start = null;
    var dur = target > 1000 ? 2600 : 1400;
    function step(t) {
      if (!start) start = t;
      var k = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - k, 4);
      el.textContent = prefix + Math.round(target * eased).toLocaleString("en-US") + suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ── Reveal on scroll ──
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  function startReveals() {
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }
  // wait for the loading screen to finish so the first animations aren't missed
  if (document.documentElement.classList.contains("intro")) document.addEventListener("intro:done", startReveals, { once: true });
  else startReveals();

  // ── Clouds flip on tap (hover already flips on desktop) ──
  document.querySelectorAll(".cloud-card").forEach(function (card) {
    function toggle() {
      var open = card.getAttribute("aria-expanded") === "true";
      card.setAttribute("aria-expanded", open ? "false" : "true");
    }
    card.addEventListener("click", function (e) {
      if (!e.target.closest("a")) toggle();
    });
    card.addEventListener("keydown", function (e) {
      if (e.target !== card || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      toggle();
    });
  });

  // ── Endorsement speech bubbles ──
  var tabs = document.querySelectorAll(".bubble");
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    });
    tab.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      next.click();
    });
  });

  // ── Hang the light bulbs along the wire ──
  var wire = document.querySelector(".lights .wire");
  if (wire) {
    var total = wire.getTotalLength();
    document.querySelectorAll(".lights .bulb").forEach(function (b) {
      var pt = wire.getPointAtLength(total * parseFloat(b.dataset.t));
      b.setAttribute("cx", pt.x);
      b.setAttribute("cy", pt.y + 6);
    });
  }

  // ── Highlight the current section in the nav ──
  var links = document.querySelectorAll(".topnav a");
  var navIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach(function (a) {
    var href = a.getAttribute("href");
    var s = href.charAt(0) === "#" && document.querySelector(href);
    if (s) navIO.observe(s);
  });
})();
