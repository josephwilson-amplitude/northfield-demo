/* Product detail page: product.html?id=ELEC-1001&via=search&q=headphones&pos=3 */
(function () {
  const p = NF.byId(NF.param('id'));
  NF.boot(p ? p.item_category : null);
  const main = document.getElementById('product-main');

  if (!p) {
    main.innerHTML = '<div class="empty"><h1>We couldn\'t find that product</h1><p class="muted">It may have sold out or moved.</p><p><a class="btn" href="index.html">Back to the home page</a></p></div>';
    return;
  }
  document.title = p.item_name + ' — Northfield & Co';

  // ---- Product Viewed ----
  // discovery_method comes from the link the shopper followed. A bare deep link with no
  // "via" (typed URL, bookmark) is counted as category_browse.
  let via = NF.param('via');
  if (NF.DISCOVERY_METHODS.indexOf(via) < 0) via = 'category_browse';
  const viewed = { products: [NF.productCore(p)], discovery_method: via };
  if (via === 'search' && NF.param('q')) viewed.search_term = NF.param('q');
  const pos = parseInt(NF.param('pos'), 10);
  if (pos > 0) viewed.list_position = pos;
  viewed.in_stock = true;
  NF.track('Product Viewed', viewed);

  // ---- Page ----
  const sale = NF.isSale(p);
  const r = NF.rating(p);
  const stars = '★★★★★'.slice(0, Math.round(r.average)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(r.average));
  const saved = NF.getSaved().indexOf(p.item_id) >= 0;
  const reviewCopy = [
    ['Lovely quality', 'Exactly as described and arrived the next day. Would buy again.'],
    ['Great gift', 'Bought this for my sister and she uses it every day.'],
    ['Good value', 'Feels more expensive than it is. Nicely packaged too.'],
    ['Does the job', 'Simple and well made. Took a star off for the slow delivery.'],
    ['Really pleased', 'Better than the branded one I had before.']
  ];
  const back = via === 'search' && NF.param('q')
    ? '<a href="search.html?q=' + encodeURIComponent(NF.param('q')) + '">Search results</a>'
    : '<a href="' + NF.categoryUrl(p.item_category) + '">' + p.item_category + '</a>';

  main.innerHTML = '' +
    '<div class="crumbs" style="padding-top:24px"><a href="index.html">Home</a> / ' + back + ' / ' + NF.esc(p.item_name) + '</div>' +
    '<div class="pdp">' +
    '<div class="pdp-media">' + (sale ? '<span class="badge">Holiday Sale</span>' : '') + NF.art(p.item_category) + '</div>' +
    '<div class="pdp-info">' +
    '<div class="brand-label">' + p.item_brand + '</div>' +
    '<h1>' + NF.esc(p.item_name) + '</h1>' +
    '<div><span class="stars" aria-hidden="true">' + stars + '</span> <span class="small">' + r.average.toFixed(1) + '</span> · <button class="linkish small" type="button" id="reviews-toggle">Read ' + r.count + ' reviews</button></div>' +
    '<div class="pdp-price"><span class="price' + (sale ? ' sale' : '') + '">' + NF.money(p.price) + '</span>' + (sale ? '<span class="was">' + NF.money(NF.wasPrice(p)) + '</span>' : '') + '</div>' +
    '<p>' + NF.esc(DESCRIPTIONS[p.item_id] || '') + '</p>' +
    '<div class="small muted">In stock. Free delivery over $50. Order by 20 December for Christmas delivery.</div>' +
    '<div class="pdp-actions">' +
    '<div class="qty"><button type="button" id="qty-minus" aria-label="Fewer">−</button><span id="qty">1</span><button type="button" id="qty-plus" aria-label="More">+</button></div>' +
    '<button class="btn btn-lg" type="button" id="add-btn">Add to basket</button>' +
    '<button class="btn btn-lg btn-ghost" type="button" id="save-btn" aria-pressed="' + saved + '">' + (saved ? 'Saved' : 'Save for later') + '</button>' +
    '</div>' +
    '<div class="added-note" id="added-note" hidden></div>' +
    '<ul class="facts"><li><span>Brand</span><span>' + p.item_brand + '</span></li><li><span>Department</span><span>' + p.item_category + '</span></li><li><span>Collection</span><span>' + p.collection + '</span></li><li><span>Product code</span><span>' + p.item_id + '</span></li></ul>' +
    '<div class="reviews" id="reviews" hidden><h3>Customer reviews</h3>' +
    reviewCopy.map(function (rv) { return '<div class="review"><span class="stars">★★★★★</span><strong>' + rv[0] + '</strong><span class="small">' + rv[1] + '</span></div>'; }).join('') +
    '</div>' +
    '</div></div>' +
    '<section class="section" style="padding-top:0"><div class="section-head"><h2>You may also like</h2></div><div class="grid grid-4" id="recs"></div></section>';

  // Quantity
  let qty = 1;
  const qtyEl = document.getElementById('qty');
  document.getElementById('qty-minus').onclick = function () { qty = Math.max(1, qty - 1); qtyEl.textContent = qty; };
  document.getElementById('qty-plus').onclick = function () { qty = Math.min(10, qty + 1); qtyEl.textContent = qty; };

  // Add to Cart
  document.getElementById('add-btn').onclick = function () {
    const t = NF.addToCart(p.item_id, qty);
    const note = document.getElementById('added-note');
    note.hidden = false;
    note.innerHTML = 'Added to your basket. You have ' + t.cart_item_count + (t.cart_item_count === 1 ? ' item' : ' items') + ' (' + NF.money(t.cart_total) + '). <a href="cart.html">View basket</a>';
  };

  // Product Saved
  document.getElementById('save-btn').onclick = function () {
    const on = NF.toggleSaved(p.item_id);
    this.setAttribute('aria-pressed', on);
    this.textContent = on ? 'Saved' : 'Save for later';
  };

  // Product Review Read: fires each time the reviews are opened
  document.getElementById('reviews-toggle').onclick = function () {
    const box = document.getElementById('reviews');
    box.hidden = !box.hidden;
    this.textContent = box.hidden ? 'Read ' + r.count + ' reviews' : 'Hide reviews';
    if (!box.hidden) {
      NF.track('Product Review Read', { item_id: p.item_id, reviews_read: reviewCopy.length, average_rating: r.average });
    }
  };

  // You may also like: same department first, then anything else
  const recs = CATALOGUE.filter(function (x) { return x.item_id !== p.item_id && x.item_category === p.item_category; })
    .concat(CATALOGUE.filter(function (x) { return x.item_category !== p.item_category && NF.isSale(x); }))
    .slice(0, 4);
  document.getElementById('recs').innerHTML = recs.map(function (x, i) {
    return NF.card(x, { via: 'recommendation', pos: i + 1, module: 'You may also like' });
  }).join('');

  NF.observePromos();
})();
