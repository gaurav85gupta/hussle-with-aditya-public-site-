/* ===== VIDEO TESTIMONIALS (GET /public/testimonials) =====
   Only testimonials published in the Super Admin appear here. With none published (or if the API
   fails) the whole Testimonials block stays hidden, so no placeholder reviews are ever shown.
   Text is inserted with textContent; embed/thumbnail URLs are pattern-checked; a video loads only on play. */
(function () {
  var wrap = document.getElementById('tWrap'), grid = document.getElementById('tGrid');
  if (!wrap || !grid) return;

  var EMBED_RE = /^https:\/\/player\.mediadelivery\.net\/embed\/\d{1,20}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  var THUMB_RE = /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\/[0-9a-f-]{36}\/[A-Za-z0-9._-]+$/i;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function buildCard(item) {
    var card = el('div', 'vt vt-reel');
    var media = el('div', 'vt-media');

    // Player is embedded directly: only Bunny's own play button is shown (single click to play)
    if (EMBED_RE.test(item.embedUrl || '')) {
      var frame = document.createElement('iframe');
      frame.title = item.title || 'Video testimonial';
      frame.loading = 'lazy';
      frame.setAttribute('allow', 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture');
      frame.setAttribute('allowfullscreen', '');
      frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      frame.src = item.embedUrl + '?autoplay=false&preload=false';
      media.appendChild(frame);
    }
    card.appendChild(media); // video-only card (no title/description/name)
    return card;
  }

  Api.request('/public/testimonials', { timeoutMs: 8000 })
    .then(function (data) {
      var items = (data && data.items) || (Array.isArray(data) ? data : []);
      if (!items.length) return;
      items.forEach(function (it) { grid.appendChild(buildCard(it)); });
      wrap.hidden = false;
    })
    .catch(function () { /* keep the block hidden; the rest of the page is unaffected */ });
})();