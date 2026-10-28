/* Mobile menu (☰): close it when the user taps anywhere outside the menu,
   or taps a menu link. Works on top of navbar.js - it simply "presses" the
   ☰ button for the user, so the existing open/close logic stays in charge. */
(function () {
  var burger = document.getElementById('burger');
  var links = document.getElementById('links');
  if (!burger || !links) return;

  function burgerVisible() {
    var cs = getComputedStyle(burger);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  }

  function menuIsOpen() {
    if (!burgerVisible()) return false;               // desktop layout: no dropdown
    var cs = getComputedStyle(links);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return false;
    var r = links.getBoundingClientRect();
    return r.height > 8 && r.width > 8 &&
           r.bottom > 0 && r.right > 0 &&
           r.top < window.innerHeight && r.left < window.innerWidth;
  }

  function closeMenu() { if (menuIsOpen()) burger.click(); }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (burger.contains(t)) return;                    // the ☰ button toggles by itself

    if (links.contains(t)) {                           // tapped a menu link -> close after it
      if (t.closest && t.closest('a')) setTimeout(closeMenu, 60);
      return;
    }
    closeMenu();                                       // tapped anywhere else
  });

  // Pressing Esc also closes it
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();
