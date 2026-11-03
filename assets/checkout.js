/* Checkout: Checkout Started on open, Order Completed on place order, confirmation in-page */
(function () {
  NF.boot('checkout');
  const main = document.getElementById('checkout-main');
  const t = NF.cartTotals();

  if (!t.products.length) {
    main.innerHTML = '<div class="empty"><h1>Your basket is empty</h1><p class="muted">Add something to your basket before checking out.</p><p><a class="btn" href="index.html">Start shopping</a></p></div>';
    return;
  }

  function paymentSaved() {
    const u = NF.getUser();
    return !!(u && u.payment_method_saved);
  }

  let deliveryOption = 'standard';
  NF.track('Checkout Started', {
    products: t.products,
    cart_total: t.cart_total,
    cart_item_count: t.cart_item_count,
    currency: 'USD',
    delivery_fee: t.delivery_fee,
    delivery_option: deliveryOption,
    payment_method_saved: paymentSaved()
  });

  function render() {
    const u = NF.getUser();
    const saved = paymentSaved();
    const fee = t.delivery_fee ? NF.money(t.delivery_fee) : 'Free';
    main.innerHTML = '<div class="page-head"><div class="crumbs"><a href="cart.html">Basket</a> / Checkout</div><h1>Checkout</h1></div>' +
      '<div class="cart-layout"><form id="checkout-form">' +
      (u ? '' : '<div class="signin-prompt"><div><strong>Have an account?</strong><div class="small muted">Sign in to use your saved card and collect points.</div></div><button class="btn btn-ghost" type="button" id="checkout-signin">Sign in</button></div>') +
      '<div class="step"><h2>Delivery address</h2>' +
      '<div class="field"><label for="ship-name">Full name</label><input type="text" id="ship-name" value="' + NF.esc(u ? u.name : 'Demo Shopper') + '"></div>' +
      '<div class="field"><label for="ship-line">Address</label><input type="text" id="ship-line" value="12 Market Street"></div>' +
      '<div class="row-2"><div class="field"><label for="ship-city">City</label><input type="text" id="ship-city" value="Springfield"></div>' +
      '<div class="field"><label for="ship-zip">ZIP code</label><input type="text" id="ship-zip" value="62701"></div></div></div>' +
      '<div class="step"><h2>Delivery</h2><div class="options">' +
      option('standard', 'Standard delivery', '3 to 5 working days', fee) +
      option('next_day', 'Next day delivery', 'Order by 8pm', fee) +
      option('click_collect', 'Click &amp; collect', 'Ready in 2 hours from your local store', fee) +
      '</div></div>' +
      '<div class="step"><h2>Payment</h2><div class="options">' +
      (saved
        ? '<label class="option"><input type="radio" name="pay" checked><span class="opt-main"><strong>Saved card ending 4242</strong><br><span class="small muted">Expires 08/29</span></span></label>'
        : '<label class="option"><input type="radio" name="pay" checked><span class="opt-main"><strong>Demo payment</strong><br><span class="small muted">No real payment is taken on this demo site.</span></span></label>') +
      '</div></div>' +
      '<div class="summary-row summary-total" style="margin-bottom:14px"><span>To pay</span><span>' + NF.money(t.cart_total + t.delivery_fee) + '</span></div>' +
      '<button class="btn btn-lg btn-block" type="submit" id="place-order">Place order</button>' +
      '</form>' +
      '<aside class="panel"><h2 style="font-size:1.3rem">Your order</h2>' +
      t.products.map(function (l) { return '<div class="mini-line"><span>' + l.quantity + ' × ' + NF.esc(l.item_name) + '</span><span>' + NF.money(l.item_revenue) + '</span></div>'; }).join('') +
      '<div class="summary-row" style="border-top:1px solid var(--line);margin-top:10px;padding-top:12px"><span>Subtotal</span><span>' + NF.money(t.cart_total) + '</span></div>' +
      '<div class="summary-row"><span>Delivery</span><span>' + fee + '</span></div>' +
      '<div class="summary-row summary-total"><span>Total</span><span>' + NF.money(t.cart_total + t.delivery_fee) + '</span></div>' +
      '</aside></div>';

    const signin = document.getElementById('checkout-signin');
    if (signin) signin.onclick = function () { NF.openLogin(function () { render(); }); };
    main.querySelectorAll('input[name="delivery"]').forEach(function (r) {
      r.addEventListener('change', function () { deliveryOption = r.value; });
    });
    document.getElementById('checkout-form').addEventListener('submit', placeOrder);
  }

  function option(value, title, sub, price) {
    return '<label class="option"><input type="radio" name="delivery" value="' + value + '"' + (deliveryOption === value ? ' checked' : '') + '>' +
      '<span class="opt-main"><strong>' + title + '</strong><br><span class="small muted">' + sub + '</span></span><span class="opt-side">' + price + '</span></label>';
  }

  function placeOrder(e) {
    e.preventDefault();
    const btn = document.getElementById('place-order');
    btn.disabled = true;
    btn.textContent = 'Placing your order…';
    const u = NF.getUser();
    const history = NF.read('nf_orders', []);
    const isFirst = u && u.shopper_segment === 'Returning loyal shopper' ? false : history.length === 0;
    const d = new Date();
    const orderId = 'NF' + d.toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(Math.floor(1000 + Math.random() * 9000));
    const orderTotal = NF.round(t.cart_total + t.delivery_fee);

    NF.track('Order Completed', {
      products: t.products,
      cart_total: t.cart_total,
      cart_item_count: t.cart_item_count,
      currency: 'USD',
      delivery_fee: t.delivery_fee,
      payment_method_saved: paymentSaved(),
      order_id: orderId,
      order_total: orderTotal,
      is_first_order: isFirst
    });

    history.unshift({ order_id: orderId, total: orderTotal, items: t.cart_item_count, date: d.toISOString().slice(0, 10) });
    NF.write('nf_orders', history.slice(0, 20));
    NF.setCart([]);

    setTimeout(function () {
      main.innerHTML = '<div class="confirm"><div class="tick"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div>' +
        '<h1>Thank you for your order</h1><p class="muted">Order <strong>' + orderId + '</strong> is confirmed. We\'ll email you when it\'s on its way.</p>' +
        '<div class="panel" style="text-align:left;margin:28px 0">' +
        t.products.map(function (l) { return '<div class="mini-line"><span>' + l.quantity + ' × ' + NF.esc(l.item_name) + '</span><span>' + NF.money(l.item_revenue) + '</span></div>'; }).join('') +
        '<div class="summary-row summary-total"><span>Total paid</span><span>' + NF.money(orderTotal) + '</span></div></div>' +
        '<a class="btn" href="index.html">Continue shopping</a></div>';
      window.scrollTo(0, 0);
    }, 600);
  }

  render();
  NF.observePromos();
})();
