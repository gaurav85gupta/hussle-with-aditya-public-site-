/* =========================================================
   DIWALI DIYAS + STARS (js/diwali-lights.js)
   Extra diyas + twinkle stars.
   <body class="diwali"> hata do to kuch nahi dikhta. Koi library nahi.
   ========================================================= */
(function () {
  var d = document, b = d.body; if (!b || !b.classList.contains('diwali')) return;
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches, uid = 0;
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- 1. DIYAS (hero wale diya ka SVG reuse, unique gradient ids) ---------- */
  var srcEl = d.querySelector('.hero-diya svg'), src = srcEl ? srcEl.outerHTML : '';
  function diyaSVG() {
    var n = ++uid, h = src;
    ['tch', 'rmh', 'olh', 'flh'].forEach(function (a) { h = h.split('id="' + a + '"').join('id="' + a + 'x' + n + '"').split('url(#' + a + ')').join('url(#' + a + 'x' + n + ')'); });
    return h;
  }
  function diya(parent, cls) {
    if (!parent || !src) return;
    var e = d.createElement('div'); e.className = 'dw dw-diya ' + cls; e.setAttribute('aria-hidden', 'true'); e.innerHTML = diyaSVG(); parent.appendChild(e);
  }
  diya(d.getElementById('offer'), 'dwd-offer');
  diya(d.getElementById('reviews'), 'dwd-rev');
  d.querySelectorAll('.dw-divider').forEach(function (dv) { diya(dv, 'dwd-dv l'); diya(dv, 'dwd-dv r'); });
  diya(d.getElementById('payment-section'), 'dwd-pay');
  var ft = d.querySelector('footer.site-footer'); diya(ft, 'dwd-ft l'); diya(ft, 'dwd-ft r');
  var st = d.querySelector('.dw-strip span');
  if (st && src) { st.innerHTML = '<i class="dwd-ic" aria-hidden="true">' + diyaSVG() + '</i>' + st.textContent.replace(/^\s*\u{1FA94}\s*/u, ''); }

  /* ---------- 2. TWINKLE STARS ---------- */
  if (!rm) {
    var STAR = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C12.8 8 16 11.2 24 12C16 12.8 12.8 16 12 24C11.2 16 8 12.8 0 12C8 11.2 11.2 8 12 0Z"/></svg>';
    var TW = [['#top', 'right:9%;top:30%'], ['#top', 'left:7%;top:48%'], ['#top', 'right:32%;bottom:22%'], ['.dw-strip', 'left:22%;top:62%'], ['.dw-strip', 'right:16%;top:22%'],
      ['#reviews', 'left:7%;top:14%'], ['#reviews', 'right:8%;top:32%'], ['#payment-section', 'left:9%;top:36%'], ['#payment-section', 'right:8%;top:16%'], ['footer.site-footer', 'left:12%;top:38%']];
    var r2 = rng(99), small = innerWidth < 640;
    TW.forEach(function (t, i) {
      if (small && i % 2) return;
      var p = d.querySelector(t[0]); if (!p) return;
      var e = d.createElement('span'); e.className = 'dw dw-tw'; e.setAttribute('aria-hidden', 'true'); e.innerHTML = STAR;
      e.style.cssText = t[1] + ';--t:' + (8 + r2() * 6).toFixed(1) + 's;--d:' + (-r2() * 10).toFixed(1) + 's;width:' + (11 + r2() * 7).toFixed(0) + 'px;height:' + (11 + r2() * 7).toFixed(0) + 'px';
      p.appendChild(e);
    });
  }
})();
