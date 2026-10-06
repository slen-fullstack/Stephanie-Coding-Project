// Mobile menu, slideshows and image lightbox.
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  toggle.addEventListener('click', function () {
    var open = header.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.parentElement.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  });

  document.querySelectorAll('.slideshow').forEach(function (show) {
    var thumbs = Array.prototype.slice.call(show.querySelectorAll('.thumb'));
    var link = show.querySelector('.stage a');
    var img = show.querySelector('.stage img');
    var current = 0;
    function go(i) {
      if (!thumbs.length) return;
      current = (i + thumbs.length) % thumbs.length;
      var src = thumbs[current].dataset.src;
      img.src = src;
      link.href = src;
      thumbs.forEach(function (t, n) { t.classList.toggle('on', n === current); });
    }
    thumbs.forEach(function (t, n) { t.addEventListener('click', function () { go(n); }); });
    var prev = show.querySelector('.prev'), next = show.querySelector('.next');
    if (prev) prev.addEventListener('click', function () { go(current - 1); });
    if (next) next.addEventListener('click', function () { go(current + 1); });
  });

  var box = document.querySelector('.lightbox');
  var boxImg = box.querySelector('img');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.zoom');
    if (!a) return;
    e.preventDefault();
    boxImg.src = a.getAttribute('href');
    box.hidden = false;
  });
  function close() { box.hidden = true; boxImg.removeAttribute('src'); }
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
