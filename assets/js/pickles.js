// Pickles starts flying once her patch of sky scrolls into view; click for a boop.
(function () {
  var sky = document.querySelector(".pickles-sky");
  if (!sky) return;
  var cat = sky.querySelector(".pickles");
  new IntersectionObserver(function (entries, obs) {
    if (!entries[0].isIntersecting) return;
    sky.classList.add("go");
    obs.disconnect();
  }, { threshold: 0.2 }).observe(sky);

  cat.addEventListener("click", function () {
    cat.classList.remove("boop"); void cat.offsetWidth; cat.classList.add("boop");
    ["💛", "✨", "🐾"].forEach(function (h, i) {
      var s = document.createElement("span");
      s.className = "pickles-heart";
      s.textContent = h;
      s.style.setProperty("--dx", (i - 1) * 30 + "px");
      cat.appendChild(s);
      setTimeout(function () { s.remove(); }, 1000);
    });
  });
})();
