/* ===== LIVE PRICE (GET /public/config) =====
   The HTML ships with ₹99 / ₹1,999 as a fallback only. On load the server's price replaces it
   everywhere. If the server cannot be reached, the fallback stays but a visible note says it is unconfirmed. */
(function () {
  var fmt = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };

  function rupees(paise) { return paise / 100; }

  function replaceTextTokens(from, to) {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode && n.parentNode.nodeName;
        return (p === 'SCRIPT' || p === 'STYLE' || p === 'NOSCRIPT') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\d,])', 'g');
    var nodes = [], n;
    while ((n = walker.nextNode())) { if (re.test(n.nodeValue)) nodes.push(n); re.lastIndex = 0; }
    nodes.forEach(function (node) { node.nodeValue = node.nodeValue.replace(re, to); });
    document.title = document.title.replace(re, to);
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = meta.content.replace(re, to);
  }

  function applyPrice(price, offerEnabled, comparePrice) {
    // Strike-through / % OFF only when the admin set a comparison price that is above the real price.
    var showCompare = !!offerEnabled && comparePrice != null && comparePrice > price;

    if (fmt(price) !== '₹99') replaceTextTokens('₹99', fmt(price));
    var num = document.querySelector('[data-price-num]');
    if (num) num.textContent = Number(price).toLocaleString('en-IN');

    // Special-offer tag + countdown follow the "Offer enabled" switch.
    document.querySelectorAll('[data-offer]').forEach(function (el) { el.hidden = !offerEnabled; });
    // Struck-through original price + "% OFF – You save" follow the comparison price.
    document.querySelectorAll('[data-compare]').forEach(function (el) { el.hidden = !showCompare; });
    if (showCompare) {
      document.querySelectorAll('[data-list-price]').forEach(function (el) { el.textContent = fmt(comparePrice); });
      var pct = Math.round((1 - price / comparePrice) * 100);
      var save = document.querySelector('[data-save]');
      if (save) save.textContent = pct + '% OFF – You save ' + fmt(comparePrice - price);
    }
    document.documentElement.setAttribute('data-price-state', 'live');
  }

  function showError() {
    document.documentElement.setAttribute('data-price-state', 'error');
    var note = document.getElementById('priceNote');
    if (note) {
      note.hidden = false;
      note.dataset.type = 'error';
      note.textContent = 'Could not confirm the current price from the server. The amount shown may be out of date — please refresh before paying.';
    }
  }

  window.Price = { ready: null, current: null };
  window.Price.ready = Api.request('/public/config')
    .then(function (data) {
      var price = rupees(data.membership.priceInPaise);
      if (data.membership.currency !== 'INR') throw new Error('Unsupported currency');
      window.Price.current = price;
      var cmp = data.membership.comparePriceInPaise;
      applyPrice(price, !!data.membership.offerEnabled, typeof cmp === 'number' ? rupees(cmp) : null);
      return data;
    })
    .catch(function () { showError(); return null; });
})();
