/* DIWALI (js/diwali.js): rangoli reveal (ek baar) + halke golden particles. <body class="diwali"> hata do to kuch nahi karta */
(function () {
  var d = document, b = d.body; if (!b || !b.classList.contains('diwali')) return;
  var root = d.documentElement, rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('dw-js');

  /* ---- rangoli: scroll par ek baar reveal ---- */
  var rg = d.querySelectorAll('.dw-rg');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { threshold: 0.05 });
    rg.forEach(function (e) { io.observe(e); });
  } else { rg.forEach(function (e) { e.classList.add('on'); }); }

  /* ---- golden particles: ek canvas, chhote aur halke ---- */
  var cv = d.querySelector('.dw-dust'); if (!cv || !cv.getContext) return;
  var cx = cv.getContext('2d'), W, H, P = [], raf = 0, dpr = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.5 : 2);
  var COL = ['229,205,145', '201,164,92', '217,154,67'];             /* champagne, muted gold, amber */
  function size() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function init() {
    var low = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
    var mob = W < 700, n = mob ? 30 : 64; if (low) n = Math.round(n * (mob ? 0.65 : 0.6));
    P = [];
    for (var i = 0; i < n; i++) {
      var z = Math.random(), r = Math.random();
      var glow = r < (W < 700 ? 0.07 : 0.1), bright = r >= 0.07 && r < 0.2;
      P.push({ x: Math.random() * W, y: Math.random() * H, z: z,
        r: glow ? 1.8 + Math.random() * 1.4 : 0.7 + z * 1.3,
        a: (glow ? 0.4 : bright ? 0.7 : 0.3 + Math.random() * 0.25) * (W < 700 ? 0.9 : 1.25), glow: glow,
        vx: (Math.random() - 0.5) * 0.12, vy: -(0.04 + Math.random() * 0.16),
        t: Math.random() * 6.28, ts: 0.3 + Math.random() * 0.9, c: COL[(Math.random() * 3) | 0] });
    }
  }
  function draw(t, move) {
    cx.clearRect(0, 0, W, H);
    var sy = pageYOffset;
    var dens = 1 - 0.25 * Math.min(1, sy / (innerHeight * 1.2));          /* hero me zyada, neeche kam particles */
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      if (move) { p.x += p.vx; p.y += p.vy; if (p.x < -6) p.x = W + 6; else if (p.x > W + 6) p.x = -6; }
      var y = (((p.y - sy * p.z * 0.05) % H) + H) % H;
      var a = p.a * dens * (0.6 + 0.4 * Math.sin(t / 1000 * p.ts + p.t));
      if (p.glow) {                                                     /* bahut kam particles par soft glow */
        var R = p.r * 4, g = cx.createRadialGradient(p.x, y, 0, p.x, y, R);
        g.addColorStop(0, 'rgba(' + p.c + ',' + a + ')'); g.addColorStop(0.35, 'rgba(' + p.c + ',' + a * 0.3 + ')'); g.addColorStop(1, 'rgba(' + p.c + ',0)');
        cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, y, R, 0, 6.283); cx.fill();
      } else {
        cx.fillStyle = 'rgba(' + p.c + ',' + a + ')'; cx.beginPath(); cx.arc(p.x, y, p.r, 0, 6.283); cx.fill();
      }
    }
  }
  function tick(t) { draw(t, true); raf = requestAnimationFrame(tick); }
  function start() { if (!raf && !rm) raf = requestAnimationFrame(tick); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  size(); init();
  if (rm) draw(0, false); else start();
  d.addEventListener('visibilitychange', function () { d.hidden ? stop() : start(); });
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); init(); if (rm) draw(0, false); }, 150); });
})();

/* ---- DIWALI: section dividers/ornaments/footer diamond reveal + pricing entry + hero sparkle burst (ek baar) ---- */
(function () {
  var d = document, b = d.body; if (!b || !b.classList.contains('diwali')) return;
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = d.querySelectorAll('.dw-divider, .dw-orn, .dw-fdia'), pay = d.getElementById('pay');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add(e.target === pay ? 'dw-in' : 'on'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (e) { io.observe(e); }); if (pay) io.observe(pay);
  } else { items.forEach(function (e) { e.classList.add('on'); }); if (pay) pay.classList.add('dw-in'); }

  var hero = d.getElementById('top');
  if (hero && !rm) {
    var c = d.createElement('div'); c.className = 'dw dw-burst'; c.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 14; i++) {
      var s = d.createElement('span'); s.className = 'dw-bp';
      s.style.setProperty('--a', (i * 360 / 14 + Math.random() * 12).toFixed(0) + 'deg');
      s.style.setProperty('--r', (innerWidth < 640 ? 34 + Math.random() * 26 : 56 + Math.random() * 54).toFixed(0) + 'px');
      c.appendChild(s);
    }
    hero.appendChild(c);
    setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 3400);   /* cleanup */
  }
})();
