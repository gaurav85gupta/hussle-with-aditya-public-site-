/* ===== THANK-YOU PAGE =====
   Reached only after the server confirmed the payment (payment.js sets the flag, then redirects here).
   Opening this page directly without paying sends the visitor back to the home page. No personal data is stored. */
(function () {
  var paid = false;
  try { paid = sessionStorage.getItem('hwa_paid') === '1'; } catch (e) {}
  if (!paid) { window.location.replace('index.html'); return; }

  document.getElementById('tyCard').hidden = false;

  if (typeof CONFIG !== 'undefined' && CONFIG.WHATSAPP_NUMBER) {
    var wa = document.getElementById('tyWa');
    wa.href = 'https://wa.me/' + CONFIG.WHATSAPP_NUMBER +
      '?text=' + encodeURIComponent('Hi Aditya, I have completed my payment. Sending the screenshot.');
  }
})();
