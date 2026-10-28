/* ===== API HELPER (shared by price / video / testimonials / payment) ===== */
(function () {
  var TIMEOUT_MS = 12000;

  function ApiError(message, code, status) {
    this.name = 'ApiError';
    this.message = message;
    this.code = code || null;
    this.status = status || 0;
  }
  ApiError.prototype = Object.create(Error.prototype);

  /* Resolves with payload.data. Rejects with ApiError (code from the server when present). */
  function request(path, options) {
    options = options || {};
    var ctl = new AbortController();
    var timer = setTimeout(function () { ctl.abort(); }, options.timeoutMs || TIMEOUT_MS);
    var init = { method: options.method || 'GET', headers: { Accept: 'application/json' }, signal: ctl.signal };
    if (options.body !== undefined) {
      init.headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(options.body);
    }
    return fetch(CONFIG.API_BASE_URL + path, init)
      .catch(function (err) {
        throw new ApiError(err && err.name === 'AbortError' ? 'The request timed out.' : 'Could not reach the server.', 'NETWORK_ERROR', 0);
      })
      .then(function (res) {
        return res.json().catch(function () { return null; }).then(function (payload) {
          if (!res.ok || !payload || payload.success !== true) {
            var e = payload && payload.error;
            throw new ApiError((e && e.message) || ('Request failed (' + res.status + ').'), e && e.code, res.status);
          }
          return payload.data;
        });
      })
      .finally(function () { clearTimeout(timer); });
  }

  window.Api = { request: request, ApiError: ApiError };
})();
