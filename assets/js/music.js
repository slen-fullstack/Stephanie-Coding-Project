// Soft background music: starts on the visitor's first click, tap or key press
// (browsers don't allow sound before that), with a corner button to turn it off.
(function () {
  var btn = document.getElementById("music");
  var audio = document.getElementById("music-song");
  var tip = document.getElementById("music-tip");
  if (!btn || !audio) return;

  var VOLUME = Math.min(Math.max(parseFloat(btn.dataset.volume) || 0.18, 0), 1);
  var EVENTS = ["pointerdown", "keydown", "touchend"];
  var fadeTimer, started = false, wantsOff = false;
  try { wantsOff = localStorage.getItem("music") === "off"; } catch (e) {}

  function fadeTo(target, ms, done) {
    clearInterval(fadeTimer);
    var from = audio.volume, t0 = performance.now();
    fadeTimer = setInterval(function () {
      var k = Math.min((performance.now() - t0) / ms, 1);
      audio.volume = from + (target - from) * k;
      if (k >= 1) { clearInterval(fadeTimer); if (done) done(); }
    }, 40);
  }

  function render(on) {
    btn.classList.toggle("on", on);
    btn.classList.toggle("muted", !on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "Turn music off" : "Turn music on");
    tip.textContent = on ? "Music on: click to turn off" : "Music off: click to play";
  }

  function play() {
    audio.volume = 0;
    var p = audio.play();
    if (p && p.then) p.then(function () { fadeTo(VOLUME, 2500); render(true); }).catch(function () { render(false); });
    else { fadeTo(VOLUME, 2500); render(true); }
  }

  function stop() {
    fadeTo(0, 600, function () { audio.pause(); });
    render(false);
  }

  function stopListening() {
    EVENTS.forEach(function (ev) { removeEventListener(ev, firstGesture, true); });
  }

  // the first click / tap / key anywhere starts the song, unless they turned it off before
  function firstGesture(e) {
    if (started || (e.target.closest && e.target.closest("#music"))) return;
    started = true;
    stopListening();
    if (!wantsOff) play();
  }

  btn.addEventListener("click", function () {
    started = true;
    stopListening();
    wantsOff = !(audio.paused || btn.classList.contains("muted"));
    if (wantsOff) stop(); else play();
    try { localStorage.setItem("music", wantsOff ? "off" : "on"); } catch (err) {}
  });

  EVENTS.forEach(function (ev) { addEventListener(ev, firstGesture, true); });
  if (wantsOff) render(false);
  else tip.textContent = "Music plays on your first click";
})();
