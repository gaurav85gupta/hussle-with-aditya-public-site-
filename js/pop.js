/* Pop-up animation for headings: pops in when scrolled into view */
(function () {
  var els = document.querySelectorAll('h1, h2, .final h2');
  if (!els.length) return;
  els.forEach(function (el) { el.classList.add('pop'); });
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('pop-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('pop-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  els.forEach(function (el) { io.observe(el); });
})();
