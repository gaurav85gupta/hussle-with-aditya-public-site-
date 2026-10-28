/* Customer details: must be filled & valid BEFORE the payment button works.
   After a successful check, the data is available as window.CUSTOMER_DETAILS
   ({ name, phone, state, age, email }) for the backend / payment step. */
(function () {
  /* Safety net: if the page's HTML doesn't have the optional Email field yet,
     add it here, so replacing just this file is enough. */
  var box = document.getElementById('details');
  if (box && !document.getElementById('cEmail')) {
    var f = document.createElement('div');
    f.className = 'field field-wide';
    f.style.gridColumn = '1 / -1';
    f.innerHTML =
      '<label for="cEmail">Email <span class="opt" style="font-weight:500;color:#8a8aa0;font-size:12px">(optional)</span></label>' +
      '<input type="email" id="cEmail" placeholder="you@example.com" autocomplete="email" inputmode="email" maxlength="80">' +
      '<small class="err" data-for="cEmail"></small>';
    box.appendChild(f);
  }
})();

(function () {
  var $ = function (id) { return document.getElementById(id); };

  function setErr(id, msg) {
    var el = document.querySelector('.err[data-for="' + id + '"]');
    var input = $(id);
    if (el) el.textContent = msg || '';
    if (input) input.classList.toggle('invalid', !!msg);
  }

  function validate() {
    var name = $('cName').value.trim().replace(/\s+/g, ' ');
    var phone = $('cPhone').value.trim();
    var state = $('cState').value;
    var age = parseInt($('cAge').value, 10);
    var email = $('cEmail') ? $('cEmail').value.trim() : '';
    var firstBad = null;

    function bad(id, msg) { setErr(id, msg); if (!firstBad) firstBad = $(id); }

    setErr('cName'); setErr('cPhone'); setErr('cState'); setErr('cAge'); setErr('cEmail');

    if (name.length < 2) bad('cName', 'Please enter your full name.');
    if (!/^[6-9]\d{9}$/.test(phone)) bad('cPhone', 'Enter a valid 10-digit mobile number.');
    if (!state) bad('cState', 'Please select your state.');
    if (!(age >= 13 && age <= 100)) bad('cAge', 'Enter a valid age (13–100).');

    // email is optional: only checked when the user typed something
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) bad('cEmail', 'Enter a valid email address (or leave it empty).');

    if (firstBad) { firstBad.focus(); return null; }
    return { name: name, phone: phone, state: state, age: age, email: email };
  }

  // Runs in the capture phase, so it checks the details BEFORE payment.js reacts to the click
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('#payBtn') : null;
    if (!btn) return;
    var data = validate();
    if (!data) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var box = $('details');
      if (box && box.scrollIntoView) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    window.CUSTOMER_DETAILS = data;
  }, true);

  // Phone: digits only; clear an error as soon as the user edits the field
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'cPhone') t.value = t.value.replace(/\D/g, '').slice(0, 10);
    if (t.id && document.querySelector('.err[data-for="' + t.id + '"]')) setErr(t.id);
  });
})();
