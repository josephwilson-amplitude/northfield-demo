/* Account page: shows the generated user ID and the properties sent on login */
(function () {
  NF.boot('account');
  const main = document.getElementById('account-main');

  function render() {
    const u = NF.getUser();
    if (!u) {
      main.innerHTML = '<div class="empty"><h1>Your account</h1><p class="muted">Sign in to see your orders and saved card. You can also shop as a guest.</p><p><button class="btn" type="button" id="acct-signin">Sign in</button></p></div>';
      document.getElementById('acct-signin').onclick = function () { NF.openLogin(render); };
      return;
    }
    const orders = NF.read('nf_orders', []);
    const saved = NF.getSaved().map(NF.byId).filter(Boolean);
    main.innerHTML = '<div class="page-head"><h1>Hello, ' + NF.esc(u.name) + '</h1></div>' +
      '<div class="cart-layout"><div>' +
      '<div class="panel" style="margin-bottom:24px"><h2 style="font-size:1.3rem">Your demo identity</h2>' +
      '<div class="small muted">User ID</div><div class="id-preview">' + NF.esc(u.user_id) + '</div>' +
      '<ul class="facts" style="margin:0">' +
      '<li><span>shopper_segment</span><span>' + u.shopper_segment + '</span></li>' +
      '<li><span>loyalty_tier</span><span>' + u.loyalty_tier + '</span></li>' +
      '<li><span>payment_method_saved</span><span>' + u.payment_method_saved + '</span></li>' +
      '<li><span>device_type</span><span>' + u.device_type + '</span></li></ul></div>' +
      '<h2 style="font-size:1.3rem">Recent orders</h2>' +
      (orders.length ? orders.map(function (o) { return '<div class="mini-line" style="border-bottom:1px solid var(--line);padding:12px 0"><span><strong>' + o.order_id + '</strong> · ' + o.date + ' · ' + o.items + ' items</span><span>' + NF.money(o.total) + '</span></div>'; }).join('') : '<p class="muted">No orders yet.</p>') +
      '<h2 style="font-size:1.3rem;margin-top:28px">Saved for later</h2>' +
      (saved.length ? saved.map(function (p) { return '<div class="mini-line" style="border-bottom:1px solid var(--line);padding:12px 0"><span>' + NF.esc(p.item_name) + '</span><span>' + NF.money(p.price) + '</span></div>'; }).join('') : '<p class="muted">Nothing saved yet.</p>') +
      '</div><aside class="panel"><h2 style="font-size:1.3rem">Sign out</h2><p class="small muted">Signing out resets the Amplitude identity on this browser.</p><button class="btn btn-ghost btn-block" type="button" id="acct-signout">Sign out</button></aside></div>';
    document.getElementById('acct-signout').onclick = function () {
      NF.logout();
      NF.renderAccountButton();
      render();
    };
  }
  render();
  NF.observePromos();
})();
