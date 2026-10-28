/* ===== HERO VIDEO (GET /public/hero-video) =====
   The video is chosen in the Super Admin and streamed from Bunny.net. Nothing loads from Bunny
   until the visitor presses play. URLs from the API are checked against strict patterns before use. */
(function () {
  var box = document.getElementById('videoBox');
  if (!box) return;
  var msgEl = document.getElementById('heroVideoMsg');

  var EMBED_RE = /^https:\/\/player\.mediadelivery\.net\/embed\/\d{1,20}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  var THUMB_RE = /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\/[0-9a-f-]{36}\/[A-Za-z0-9._-]+$/i;
  var PLAYER_TIMEOUT_MS = 15000;

  function showMessage(text) {
    if (!msgEl || !msgEl.isConnected) return;
    var small = msgEl.querySelector('small');
    if (small) small.textContent = text;
  }

  function clearBox() {
    Array.prototype.slice.call(box.children).forEach(function (c) { c.remove(); });
  }

  function startPlayer(item) {
    var frame = document.createElement('iframe');
    frame.title = 'Introduction video';
    frame.setAttribute('allow', 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture');
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.src = item.embedUrl + '?autoplay=false&preload=false';
    clearBox();
    box.appendChild(frame);
  }

  Api.request('/public/hero-video', { timeoutMs: 8000 })
    .then(function (data) {
      if (!data || !data.embedUrl) { showMessage('Introduction video coming soon.'); return; }
      if (!EMBED_RE.test(data.embedUrl)) { showMessage('This video cannot be played right now.'); return; }
      startPlayer(data);
    })
    .catch(function () { showMessage('The video is unavailable right now. Please refresh the page.'); });
})();