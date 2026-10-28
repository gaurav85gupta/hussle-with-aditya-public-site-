/* ===== PAYMENT FLOW =====
   details (validated by details.js) -> POST /public/leads -> POST /public/payments/create-order
   -> Razorpay Checkout -> POST /public/payments/verify.
   - The server decides the amount; the browser never sends or trusts a price.
   - Razorpay's "success" callback is NOT proof of payment: only the server's verify response is. */
(function () {
  var btn = document.getElementById('payBtn');
  var statusEl = document.getElementById('payStatus');
  if (!btn) return;

  var busy = false;
  /* Kept in memory so a retry (cancelled / failed payment) reuses the same lead and never creates duplicates. */
  var lead = { key: null, id: null, submissionId: null };

  function say(msg, type) {
    if (!statusEl) return;
    statusEl.hidden = !msg;
    statusEl.textContent = msg || '';
    statusEl.dataset.type = type || '';
  }

  function setBusy(v) {
    busy = v;
    btn.disabled = v;
    if (v) btn.setAttribute('aria-busy', 'true'); else btn.removeAttribute('aria-busy');
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return String(Date.now()) + Math.random().toString(16).slice(2);
  }

  function ensureLead(d) {
    var key = [d.name, d.phone, d.state, d.age, d.email].join('|');
    if (lead.id && lead.key === key) return Promise.resolve(lead.id);
    if (lead.key !== key) lead = { key: key, id: null, submissionId: uuid() };
    var honeypot = document.getElementById('cWebsite');
    return Api.request('/public/leads', {
      method: 'POST',
      timeoutMs: 15000,
      body: {
        submissionId: lead.submissionId,
        name: d.name,
        phone: '+91' + d.phone,
        state: d.state,
        age: d.age,
        email: d.email || '',
        website: honeypot ? honeypot.value : ''
      }
    }).then(function (data) {
      if (!data || !data.id) throw new Api.ApiError('No lead id returned.', 'NO_LEAD_ID');
      lead.id = data.id;
      return data.id;
    });
  }

  function openCheckout(order, d) {
    return new Promise(function (resolve) {
      var settled = false;
      var rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        order_id: order.orderId,
        name: CONFIG.BRAND,
        description: CONFIG.BRAND,
        prefill: { name: d.name, contact: '+91' + d.phone, email: d.email || '' },
        theme: { color: '#7c3aed' },
        modal: {
          ondismiss: function () {
            if (settled) return;
            settled = true;
            say('Payment was not completed. Your details are saved — you can pay again whenever you are ready.', 'info');
            resolve('cancelled');
          }
        },
        handler: function (response) {
          if (settled) return;
          settled = true;
          say('Confirming your payment…', 'info');
          Api.request('/public/payments/verify', {
            method: 'POST',
            timeoutMs: 20000,
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }
          }).then(function (result) {
            if (result && result.status === 'paid') {
              say('Payment successful! Redirecting…', 'success');
              try { sessionStorage.setItem('hwa_paid', '1'); } catch (e) {}
              setTimeout(function () { window.location.href = 'thank-you.html'; }, 600);
              resolve('paid');
            } else {
              say('Your payment status is being confirmed. Please do not pay again immediately — check back shortly.', 'info');
              resolve('pending');
            }
          }).catch(function (err) {
            var invalid = err && err.code === 'SIGNATURE_INVALID';
            say(invalid
              ? 'Your payment could not be verified. Please try again, or contact us if an amount was deducted.'
              : 'We could not confirm your payment automatically. If an amount was deducted, please do not pay again — contact us with your details.', 'error');
            resolve('verify_failed');
          });
        }
      });
      rzp.on('payment.failed', function () {
        if (settled) return;
        settled = true;
        say('The payment attempt failed. Your details are saved — please try again.', 'error');
        resolve('failed');
      });
      rzp.open();
    });
  }

  btn.addEventListener('click', function () {
    if (busy) return;
    var d = window.CUSTOMER_DETAILS; // set by details.js after validation
    if (!d) return;

    var honeypot = document.getElementById('cWebsite');
    if (honeypot && honeypot.value) return; // bots only

    if (typeof window.Razorpay !== 'function') {
      say('The payment window could not load. Please check your connection and refresh the page.', 'error');
      return;
    }

    setBusy(true);
    say('Saving your details…', 'info');
    var done = false;
    ensureLead(d)
      .then(function (leadId) {
        say('Preparing your payment…', 'info');
        return Api.request('/public/payments/create-order', { method: 'POST', timeoutMs: 20000, body: { leadId: leadId } });
      })
      .then(function (order) {
        done = true;
        return openCheckout(order, d);
      })
      .catch(function (err) {
        if (done) return;
        var m = err && err.code === 'NETWORK_ERROR'
          ? 'We could not reach the server. Your details are still here — please try again.'
          : 'We could not start your payment (' + ((err && err.message) || 'unknown error') + '). Please try again.';
        say(m, 'error');
      })
      .finally(function () { setBusy(false); });
  });
})();
