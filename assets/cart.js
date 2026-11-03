/* Basket page: lines, promo code (the friction story), Cart Abandoned */
(function () {
  NF.boot('cart');
  const main = document.getElementById('cart-main');
  let leavingForCheckout = false;
  let lastError = '';

  function render() {
    const t = NF.cartTotals();
    if (!t.products.length) {
      main.innerHTML = '<div class="empty"><h1>Your basket is empty</h1><p class="muted">Free delivery over $50. Order by 20 December for Christmas delivery.</p><p><a class="btn" href="index.html">Start shopping</a></p></div>';
      return;
    }
    const lines = t.products.map(function (l) {
      const p = NF.byId(l.item_id);
      return '<div class="cart-line">' + NF.art(p.item_category) +
        '<div><div class="brand-label">' + p.item_brand + '</div><h3>' + NF.esc(p.item_name) + '</h3>' +
        '<div class="small muted">' + NF.money(p.price) + (NF.isSale(p) ? ' · <span style="color:var(--sale)">Holiday Sale</span>' : '') + '</div>' +
        '<div style="display:flex;gap:14px;align-items:center;margin-top:8px"><div class="qty"><button type="button" data-dec="' + p.item_id + '" aria-label="Fewer">−</button><span>' + l.quantity + '</span><button type="button" data-inc="' + p.item_id + '" aria-label="More">+</button></div>' +
        '<button class="linkish small" type="button" data-remove="' + p.item_id + '">Remove</button></div></div>' +
        '<div class="line-total">' + NF.money(l.item_revenue) + '</div></div>';
    }).join('');
    const toFree = NF.round(50 - t.cart_total);

    main.innerHTML = '<div class="page-head"><h1>Your basket</h1><p class="muted">' + t.cart_item_count + (t.cart_item_count === 1 ? ' item' : ' items') + '</p></div>' +
      '<div class="cart-layout"><div>' + lines + '</div>' +
      '<aside class="panel">' +
      '<h2 style="font-size:1.3rem">Order summary</h2>' +
      '<div class="summary-row"><span>Subtotal</span><span>' + NF.money(t.cart_total) + '</span></div>' +
      '<div class="summary-row"><span>Delivery</span><span>' + (t.delivery_fee ? NF.money(t.delivery_fee) : 'Free') + '</span></div>' +
      (toFree > 0 ? '<div class="small muted">Spend ' + NF.money(toFree) + ' more for free delivery.</div>' : '') +
      '<form class="promo-form" id="promo-form" autocomplete="off">' +
      '<label for="promo-input">Promo code</label>' +
      '<div class="promo-row"><input type="text" id="promo-input" placeholder="Enter code" spellcheck="false"><button class="btn btn-ghost" type="submit" id="promo-apply">Apply</button></div>' +
      '<div class="promo-error" id="promo-error" role="alert"' + (lastError ? '' : ' hidden') + '>' + lastError + '</div>' +
      '</form>' +
      '<div class="summary-row summary-total"><span>Total</span><span>' + NF.money(t.cart_total + t.delivery_fee) + '</span></div>' +
      '<a class="btn btn-lg btn-block" id="checkout-btn" href="checkout.html" style="margin-top:16px">Checkout</a>' +
      '<p class="small muted" style="margin-top:12px;text-align:center">Secure checkout. Free returns until 31 January.</p>' +
      '</aside></div>' +
      '<section class="section" style="padding-top:8px"><div class="section-head"><h2>You may also like</h2></div><div class="grid grid-4" id="cart-recs"></div></section>';

    // Stocking-filler suggestions not already in the basket
    const inCart = t.products.map(function (l) { return l.item_id; });
    const recs = ['GIFT-6004', 'HOME-2005', 'APPA-4006', 'TOYS-5003', 'BEAU-3006', 'GIFT-6003']
      .filter(function (id) { return inCart.indexOf(id) < 0; }).slice(0, 4);
    document.getElementById('cart-recs').innerHTML = recs.map(function (id, i) {
      return NF.card(NF.byId(id), { via: 'recommendation', pos: i + 1, module: 'You may also like' });
    }).join('');

    document.getElementById('checkout-btn').addEventListener('click', function () { leavingForCheckout = true; });
    document.getElementById('promo-form').addEventListener('submit', applyCode);
  }

  // ---- Promo Code Rejected ----
  // Every code fails. The message is deliberately vague: that is what the replay shows.
  function applyCode(e) {
    e.preventDefault();
    const input = document.getElementById('promo-input');
    const code = input.value.trim().toUpperCase();
    if (!code) { input.focus(); return; }
    const btn = document.getElementById('promo-apply');
    const err = document.getElementById('promo-error');
    btn.disabled = true;
    btn.textContent = 'Checking…';
    err.hidden = true;
    setTimeout(function () {
      const t = NF.cartTotals();
      NF.track('Promo Code Rejected', {
        code_entered: code,
        rejection_reason: PROMO_REJECTIONS[code] || 'expired',
        cart_total: t.cart_total
      });
      lastError = 'This code cannot be applied to your basket.';
      err.textContent = lastError;
      err.hidden = false;
      btn.disabled = false;
      btn.textContent = 'Apply';
    }, 700);
  }

  // ---- Quantity changes ----
  main.addEventListener('click', function (e) {
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    const rem = e.target.closest('[data-remove]');
    if (inc) { NF.addToCart(inc.getAttribute('data-inc'), 1); render(); return; }
    if (!dec && !rem) return;
    const id = (dec || rem).getAttribute(dec ? 'data-dec' : 'data-remove');
    const cart = NF.getCart();
    const line = cart.find(function (l) { return l.item_id === id; });
    if (!line) return;
    if (rem || line.quantity <= 1) cart.splice(cart.indexOf(line), 1); else line.quantity -= 1;
    NF.setCart(cart);
    render();
  });

  // ---- Cart Abandoned ----
  // Leaving the basket any way other than the checkout button, with something in it.
  let abandonedSent = false;
  function abandon() {
    if (leavingForCheckout || abandonedSent) return;
    const t = NF.cartTotals();
    if (!t.products.length) return;
    abandonedSent = true;
    if (window.amplitude && amplitude.setTransport) amplitude.setTransport('beacon');
    NF.track('Cart Abandoned', { cart_total: t.cart_total, cart_line_count: t.cart_line_count });
    if (window.amplitude && amplitude.flush) amplitude.flush();
  }
  window.addEventListener('pagehide', abandon);

  NF.onCartCleared = render;
  render();
  NF.observePromos();
})();
