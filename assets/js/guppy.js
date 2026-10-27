// Guppy sits still; click him for a bounce and some hearts.
(function () {
  var cat = document.querySelector(".guppy");
  if (!cat) return;
  cat.addEventListener("click", function () {
    cat.classList.remove("bounce"); void cat.offsetWidth; cat.classList.add("bounce");
    ["💛", "✨", "🐾"].forEach(function (h, i) {
      var s = document.createElement("span");
      s.className = "guppy-heart";
      s.textContent = h;
      s.style.setProperty("--dx", (i - 1) * 30 + "px");
      cat.appendChild(s);
      setTimeout(function () { s.remove(); }, 1000);
    });
  });
})();
