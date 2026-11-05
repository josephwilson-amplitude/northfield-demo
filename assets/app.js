/* Northfield & Co — shared site code: tracking, cart, identity, header/footer, cards.
   Amplitude itself is loaded and initialised in each page's <head>. */
(function () {
  'use strict';

  const NF = (window.NF = {});
  const DISCOVERY_METHODS = ['search', 'recommendation', 'gift_guide', 'category_browse', 'promo_banner', 'homepage_hero'];
  NF.DISCOVERY_METHODS = DISCOVERY_METHODS;

  // ---------- Storage ----------
  function read(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ }
  }
  NF.read = read;
  NF.write = write;

  // ---------- Tracking ----------
  // Every event goes through here. window.__nfEvents keeps a copy for checking in the console.
  window.__nfEvents = [];
  NF.track = function (name, props) {
    window.__nfEvents.push({ name: name, props: props });
    console.info('[amplitude]', name, props);
    if (window.amplitude && typeof amplitude.track === 'function') amplitude.track(name, props);
  };

  // ---------- Catalogue helpers ----------
  NF.byId = function (id) { return CATALOGUE.find(function (p) { return p.item_id === id; }); };
  NF.money = function (n) { return '$' + Number(n).toFixed(2); };
  NF.round = function (n) { return Math.round(n * 100) / 100; };
  NF.isSale = function (p) { return p.sale_tag === 'Holiday Sale'; };
  NF.wasPrice = function (p) { return Math.round(p.price * 1.25); };
  NF.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; });
  };
  NF.param = function (name) { return new URLSearchParams(location.search).get(name); };

  // Path relative to the site root, so the home page is "/" both locally and under
  // https://<owner>.github.io/<repo>/
  const SITE_BASE = new URL('..', document.currentScript.src).pathname;
  NF.sitePath = function () {
    let p = location.pathname;
    if (p.indexOf(SITE_BASE) === 0) p = p.slice(SITE_BASE.length);
    p = p.replace(/(^|\/)index\.html$/, '$1');
    return '/' + p;
  };

  // The seven keys Product Viewed carries
  NF.productCore = function (p) {
    return {
      item_id: p.item_id,
      item_name: p.item_name,
      item_category: p.item_category,
      item_brand: p.item_brand,
      collection: p.collection,
      sale_tag: p.sale_tag,
      price: p.price
    };
  };

  // Deterministic review data per product
  NF.rating = function (p) {
    let h = 0;
    for (let i = 0; i < p.item_id.length; i++) h = (h * 31 + p.item_id.charCodeAt(i)) % 997;
    return { average: Math.round((3.9 + (h % 11) / 10) * 10) / 10, count: 18 + (h % 140) };
  };

  // ---------- Search ----------
  // Matches item_name, item_category and item_brand. Every word in the query has to match
  // (after dropping filler words), so deal-hunting queries like "aurora headphones 50% off"
  // return nothing.
  const STOPWORDS = ['a', 'an', 'the', 'for', 'of', 'and', 'with', 'to', 'in', 'my', 'me', 'her', 'him', 'his'];
  // Shopper words that mean something in the catalogue
  const SYNONYMS = { dad: 'gift', mum: 'gift', mom: 'gift', present: 'gift', calendar: 'advent', sweater: 'jumper' };
  function tokens(text) {
    return text.toLowerCase().split(/[^a-z0-9]+/).filter(function (w) { return w && STOPWORDS.indexOf(w) < 0; })
      .map(function (w) { w = SYNONYMS[w] || w; return w.length > 3 && /s$/.test(w) && !/ss$/.test(w) ? w.slice(0, -1) : w; });
  }
  NF.search = function (text) {
    const words = tokens(text);
    if (!words.length) return [];
    return CATALOGUE.filter(function (p) {
      const hay = (p.item_name + ' ' + p.item_category + ' ' + p.item_brand).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) >= 0; });
    });
  };

  // ---------- Cart ----------
  NF.getCart = function () { return read('nf_cart', []); };
  NF.setCart = function (cart) { write('nf_cart', cart); NF.renderCartCount(); };

  // One object per cart line, exactly the nine keys Amplitude expects
  NF.cartProducts = function (cart) {
    return (cart || NF.getCart()).map(function (line) {
      const p = NF.byId(line.item_id);
      if (!p) return null;
      return Object.assign(NF.productCore(p), {
        quantity: line.quantity,
        item_revenue: NF.round(p.price * line.quantity)
      });
    }).filter(Boolean);
  };

  NF.cartTotals = function (cart) {
    const products = NF.cartProducts(cart);
    const total = NF.round(products.reduce(function (s, l) { return s + l.item_revenue; }, 0));
    const items = products.reduce(function (s, l) { return s + l.quantity; }, 0);
    return {
      products: products,
      cart_total: total,
      cart_item_count: items,
      cart_line_count: products.length,
      delivery_fee: total >= 50 ? 0 : 4.95
    };
  };

  NF.addToCart = function (itemId, qty) {
    const cart = NF.getCart();
    const line = cart.find(function (l) { return l.item_id === itemId; });
    if (line) line.quantity += qty; else cart.push({ item_id: itemId, quantity: qty });
    NF.setCart(cart);
    const t = NF.cartTotals(cart);
    // Whole cart as it stands after the add
    NF.track('Add to Cart', {
      products: t.products,
      cart_total: t.cart_total,
      cart_item_count: t.cart_item_count,
      cart_line_count: t.cart_line_count,
      currency: 'USD'
    });
    return t;
  };

  NF.renderCartCount = function () {
    const el = document.getElementById('cart-count');
    if (!el) return;
    const n = NF.getCart().reduce(function (s, l) { return s + l.quantity; }, 0);
    el.textContent = n;
    el.hidden = n === 0;
  };

  // ---------- Saved items ----------
  NF.getSaved = function () { return read('nf_saved', []); };
  NF.toggleSaved = function (itemId) {
    const saved = NF.getSaved();
    const i = saved.indexOf(itemId);
    if (i >= 0) { saved.splice(i, 1); write('nf_saved', saved); return false; }
    saved.push(itemId);
    write('nf_saved', saved);
    const p = NF.byId(itemId);
    NF.track('Product Saved', { item_id: p.item_id, item_category: p.item_category });
    return true;
  };

  // ---------- Identity ----------
  function today() { return new Date().toISOString().split('T')[0]; }

  function generateUserId(name, demoNumber) {
    const clean = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '') || 'user';
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return `${clean}_${demoNumber}_${today}`;   // e.g. "joe_1_20261103"
  }
  NF.generateUserId = generateUserId;

  NF.detectDevice = function () {
    const touch = navigator.maxTouchPoints > 0;
    const w = Math.min(window.screen.width || window.innerWidth, window.innerWidth);
    if (touch && w < 768) return 'mobile';
    if (touch && w < 1200) return 'tablet';
    return 'desktop';
  };

  NF.SEGMENTS = {
    'Returning loyal shopper': { loyalty_tier: 'gold', payment_method_saved: true },
    'Sale-driven new guest': { loyalty_tier: 'new', payment_method_saved: false }
  };

  NF.getUser = function () {
    const u = read('nf_user', null);
    if (u && u.date !== today()) { // logins last for the day the ID was generated
      try { localStorage.removeItem('nf_user'); } catch (e) { /* ignore */ }
      if (window.amplitude && amplitude.reset) amplitude.reset();
      return null;
    }
    return u;
  };

  NF.login = function (opts) {
    const user = {
      name: opts.name.trim(),
      demo_number: opts.demoNumber,
      user_id: generateUserId(opts.name, opts.demoNumber),
      shopper_segment: opts.segment,
      loyalty_tier: opts.tier,
      payment_method_saved: !!opts.paymentSaved,
      device_type: opts.device,
      date: today()
    };
    write('nf_user', user);
    if (window.amplitude) {
      amplitude.setUserId(user.user_id);
      if (amplitude.Identify) {
        const id = new amplitude.Identify();
        id.set('shopper_segment', user.shopper_segment);
        id.set('loyalty_tier', user.loyalty_tier);
        id.set('payment_method_saved', user.payment_method_saved);
        id.set('device_type', user.device_type);
        amplitude.identify(id);
      }
    }
    console.info('[amplitude] setUserId', user.user_id);
    return user;
  };

  NF.logout = function () {
    try { localStorage.removeItem('nf_user'); } catch (e) { /* ignore */ }
    if (window.amplitude && amplitude.reset) amplitude.reset();
    console.info('[amplitude] reset');
  };

  // ---------- Icons ----------
  const ICONS = {
    Electronics: '<path d="M7 14v-2a5 5 0 0 1 10 0v2"/><rect x="4.5" y="13.5" width="4" height="6" rx="1.5"/><rect x="15.5" y="13.5" width="4" height="6" rx="1.5"/>',
    Home: '<path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10v9h11v-9"/><path d="M10.5 19v-5h3v5"/>',
    Beauty: '<rect x="9" y="9" width="6" height="11" rx="1.5"/><path d="M10 9V6.5h4V9"/><path d="M11 4h2"/>',
    Apparel: '<path d="M9 4.5 4.5 7l1.5 4 2-1v9.5h8V10l2 1 1.5-4L15 4.5a3 3 0 0 1-6 0Z"/>',
    Toys: '<rect x="5" y="9" width="14" height="9" rx="2"/><circle cx="9" cy="13.5" r="1"/><circle cx="15" cy="13.5" r="1"/><path d="M12 9V6M10 5h4"/>',
    Gifting: '<rect x="4.5" y="9" width="15" height="10.5" rx="1"/><path d="M3.5 9h17M12 9v10.5"/><path d="M12 9c-1.5-3.5-5-3.5-5-1.5S10 9 12 9Zm0 0c1.5-3.5 5-3.5 5-1.5S14 9 12 9Z"/>'
  };
  NF.art = function (category, extraClass) {
    return '<div class="ph ph-' + category + ' ' + (extraClass || '') + '" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">' +
      ICONS[category] + '</svg></div>';
  };
  const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>';
  NF.HEART = HEART;

  // ---------- Links ----------
  // Every product link says how the shopper got there; product.html reads it into discovery_method
  NF.productUrl = function (p, via, extra) {
    const qs = new URLSearchParams({ id: p.item_id, via: via });
    if (extra && extra.pos) qs.set('pos', extra.pos);
    if (extra && extra.q) qs.set('q', extra.q);
    return 'product.html?' + qs.toString();
  };
  NF.categoryUrl = function (name) { return 'category.html?category=' + encodeURIComponent(name); };
  NF.collectionUrl = function (name) { return 'category.html?collection=' + encodeURIComponent(COLLECTION_SLUGS[name] || name); };
  NF.collectionLabel = function (name) { return COLLECTION_LABELS[name] || name; };
  // Accepts a slug ("deals") or a full collection name
  NF.collectionFromParam = function (param) {
    if (!param) return null;
    const bySlug = Object.keys(COLLECTION_SLUGS).find(function (k) { return COLLECTION_SLUGS[k] === param.toLowerCase(); });
    return bySlug || (COLLECTIONS.indexOf(param) >= 0 ? param : null);
  };

  // ---------- Product card ----------
  // opts: { via, pos, q, module } — module marks a recommendation module
  NF.card = function (p, opts) {
    opts = opts || {};
    const sale = NF.isSale(p);
    const saved = NF.getSaved().indexOf(p.item_id) >= 0;
    const href = NF.productUrl(p, opts.via, { pos: opts.pos, q: opts.q });
    const badge = sale ? '<span class="badge">Holiday Sale</span>'
      : (p.collection === 'New Arrivals' ? '<span class="badge badge-new">New</span>' : '');
    return '<article class="card">' + badge +
      '<button class="save-btn" type="button" data-save="' + p.item_id + '" aria-pressed="' + saved + '" aria-label="Add to wishlist">' + HEART + '</button>' +
      '<a class="card-link" href="' + href + '"' + (opts.module ? ' data-rec-module="' + NF.esc(opts.module) + '"' : '') + '>' +
      NF.art(p.item_category) +
      '<div class="card-body">' +
      '<span class="brand-label">' + NF.esc(p.item_brand) + '</span>' +
      '<span class="card-name">' + NF.esc(p.item_name) + '</span>' +
      '<div class="price-row"><span class="price' + (sale ? ' sale' : '') + '">' + NF.money(p.price) + '</span>' +
      (sale ? '<span class="was">' + NF.money(NF.wasPrice(p)) + '</span>' : '') + '</div>' +
      '</div></a></article>';
  };

  // ---------- Header / footer ----------
  function headerHtml(active) {
    const navCats = CATEGORIES.map(function (c) {
      return '<li><a href="' + NF.categoryUrl(c) + '"' + (active === c ? ' class="active"' : '') + '>' + c + '</a></li>';
    }).join('');
    const navCols = [
      ['Black Friday Deals', 'nav-sale'], ['Gift Guide', ''], ['New Arrivals', '']
    ].map(function (c) {
      return '<li><a href="' + NF.collectionUrl(c[0]) + '" class="' + c[1] + (active === c[0] ? ' active' : '') + '">' + NF.collectionLabel(c[0]) + '</a></li>';
    }).join('');
    return '' +
      '<div class="promo-banner" data-promo-name="Holiday Codes Banner" data-promo-slot="sticky_banner">' +
      'Holiday Sale now on. Up to 25% off gifts for everyone on your list. ' +
      '<a href="' + NF.collectionUrl('Black Friday Deals') + '">Shop the deals</a></div>' +
      '<header class="site-header"><div class="wrap">' +
      '<div class="header-row">' +
      '<a class="logo" href="index.html"><span class="logo-mark">N</span><span class="logo-word">Northfield &amp; Co</span></a>' +
      '<form class="search-form" action="search.html" method="get" role="search">' +
      '<input type="search" name="q" placeholder="Search gifts, brands and more" aria-label="Search" autocomplete="off" value="' + NF.esc(active === 'search' ? (NF.param('q') || '') : '') + '">' +
      '<button class="btn" type="submit">Search</button></form>' +
      '<div class="header-actions">' +
      '<button type="button" id="account-btn"></button>' +
      '<a href="cart.html" aria-label="Basket">Basket <span class="cart-count" id="cart-count" hidden>0</span></a>' +
      '</div></div></div>' +
      '<nav class="nav" aria-label="Main"><div class="wrap"><ul>' + navCols + navCats + '</ul></div></nav>' +
      '</header>';
  }

  function footerHtml() {
    return '<footer class="site-footer"><div class="wrap"><div class="footer-grid">' +
      '<div><a class="logo" href="index.html"><span class="logo-mark">N</span><span class="logo-word">Northfield &amp; Co</span></a>' +
      '<p style="margin-top:14px;max-width:26em">Good things for home, family and the people you love. Free delivery over $50. Order by 20 December for Christmas delivery.</p>' +
      '<p class="small">Sign up to our emails for early access to the sale.</p></div>' +
      '<div><h4>Shop</h4><ul>' + CATEGORIES.map(function (c) { return '<li><a href="' + NF.categoryUrl(c) + '">' + c + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>Collections</h4><ul>' + COLLECTIONS.map(function (c) { return '<li><a href="' + NF.collectionUrl(c) + '">' + NF.collectionLabel(c) + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>Help</h4><ul><li><a href="account.html">Your account</a></li><li><a href="cart.html">Basket</a></li><li>Delivery &amp; returns</li><li>Contact us</li></ul></div>' +
      '</div><p class="small" style="margin-top:28px">Northfield &amp; Co is a fictional retailer built for a product analytics demo. No real orders are taken.</p></div></footer>';
  }

  function renderAccountButton() {
    const btn = document.getElementById('account-btn');
    if (!btn) return;
    const u = NF.getUser();
    btn.textContent = u ? 'Hi, ' + u.name.split(' ')[0] : 'Sign in';
    btn.onclick = function () { if (u) location.href = 'account.html'; else NF.openLogin(); };
  }
  NF.renderAccountButton = renderAccountButton;

  // ---------- Login modal ----------
  NF.openLogin = function (onDone) {
    const existing = document.getElementById('login-modal');
    if (existing) existing.remove();
    const device = NF.detectDevice();
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.id = 'login-modal';
    wrap.innerHTML = '' +
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="login-title">' +
      '<div class="modal-head"><h2 id="login-title">Sign in</h2><button class="icon-btn" type="button" data-close aria-label="Close">×</button></div>' +
      '<p class="muted small">Demo sign-in. Your name and demo number make your user ID.</p>' +
      '<form id="login-form">' +
      '<div class="row-2"><div class="field"><label for="login-name">Name</label><input type="text" id="login-name" required autocomplete="off" placeholder="Joe"></div>' +
      '<div class="field"><label for="login-demo">Demo number</label><input type="number" id="login-demo" min="1" value="1"></div></div>' +
      '<div class="small muted">User ID</div><div class="id-preview" id="login-id"></div>' +
      '<div class="field"><label>Shopper segment</label><div class="seg-options">' +
      '<label class="option"><input type="radio" name="segment" value="Returning loyal shopper" checked><span class="opt-main"><strong>Returning loyal shopper</strong><br><span class="small muted">Gold tier, saved card</span></span></label>' +
      '<label class="option"><input type="radio" name="segment" value="Sale-driven new guest"><span class="opt-main"><strong>Sale-driven new guest</strong><br><span class="small muted">New tier, no saved card</span></span></label>' +
      '</div></div>' +
      '<div class="row-2"><div class="field"><label for="login-tier">Loyalty tier</label><select id="login-tier"><option>gold</option><option>silver</option><option>new</option></select></div>' +
      '<div class="field"><label for="login-device">Device</label><select id="login-device"><option>desktop</option><option>mobile</option><option>tablet</option></select></div></div>' +
      '<label class="option" style="margin-bottom:18px"><input type="checkbox" id="login-pay" checked><span class="opt-main">Payment method saved</span></label>' +
      '<button class="btn btn-block btn-lg" type="submit">Sign in</button>' +
      '</form></div>';
    document.body.appendChild(wrap);

    const nameEl = wrap.querySelector('#login-name');
    const demoEl = wrap.querySelector('#login-demo');
    const idEl = wrap.querySelector('#login-id');
    const tierEl = wrap.querySelector('#login-tier');
    const payEl = wrap.querySelector('#login-pay');
    wrap.querySelector('#login-device').value = device;
    function demoNumber() { return Math.max(1, parseInt(demoEl.value, 10) || 1); }
    function preview() { idEl.textContent = generateUserId(nameEl.value, demoNumber()); }
    function applySegment() {
      const seg = wrap.querySelector('input[name="segment"]:checked').value;
      tierEl.value = NF.SEGMENTS[seg].loyalty_tier;
      payEl.checked = NF.SEGMENTS[seg].payment_method_saved;
    }
    nameEl.addEventListener('input', preview);
    demoEl.addEventListener('input', preview);
    wrap.querySelectorAll('input[name="segment"]').forEach(function (r) { r.addEventListener('change', applySegment); });
    applySegment();
    preview();
    setTimeout(function () { nameEl.focus(); }, 30);

    function close() { wrap.remove(); }
    wrap.querySelector('[data-close]').onclick = close;
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    wrap.querySelector('#login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!nameEl.value.trim()) { nameEl.focus(); return; }
      const user = NF.login({
        name: nameEl.value,
        demoNumber: demoNumber(),
        segment: wrap.querySelector('input[name="segment"]:checked').value,
        tier: tierEl.value,
        paymentSaved: payEl.checked,
        device: wrap.querySelector('#login-device').value
      });
      close();
      renderAccountButton();
      NF.toast('Signed in as ' + user.user_id);
      if (onDone) onDone(user);
    });
  };

  // ---------- Toast ----------
  NF.toast = function (msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  };

  // ---------- Promotion Viewed ----------
  // Fires once per page load when a promo is at least half visible.
  // The sticky banner sits on every page, so it fires once per browser session.
  NF.observePromos = function () {
    const els = document.querySelectorAll('[data-promo-name]');
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        const el = en.target;
        io.unobserve(el);
        const slot = el.getAttribute('data-promo-slot');
        if (slot === 'sticky_banner') {
          try {
            if (sessionStorage.getItem('nf_banner_seen')) return;
            sessionStorage.setItem('nf_banner_seen', '1');
          } catch (e) { /* ignore */ }
        }
        NF.track('Promotion Viewed', { promotion_name: el.getAttribute('data-promo-name'), promotion_slot: slot });
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  };

  // ---------- Presenter cheat sheet (Shift + D) ----------
  function presenterHtml() {
    function links(list) {
      return list.map(function (t) { return '<li><a href="search.html?q=' + encodeURIComponent(t) + '">' + NF.esc(t) + '</a></li>'; }).join('');
    }
    return '<div style="display:flex;justify-content:space-between;align-items:center"><strong>Presenter notes</strong><button class="icon-btn" type="button" data-close-presenter aria-label="Close">×</button></div>' +
      '<p class="small muted" style="margin:4px 0 0">Shift + D to hide.</p>' +
      '<h4>Three routes, one order</h4><ul>' +
      '<li>Home hero → <em>homepage_hero</em></li>' +
      '<li>Home smartwatch tile → <em>promo_banner</em></li>' +
      '<li>Home "Recommended for you" or product page "You may also like" → <em>recommendation</em></li>' +
      '<li>Gift Guide page or home Gift Guide row → <em>gift_guide</em></li>' +
      '<li>Any category or collection page → <em>category_browse</em></li>' +
      '<li>Search results → <em>search</em></li></ul>' +
      '<h4>Promo codes (all rejected)</h4><ul>' +
      Object.keys(PROMO_REJECTIONS).map(function (c) { return '<li><code>' + c + '</code> → ' + PROMO_REJECTIONS[c] + '</li>'; }).join('') +
      '<li>anything else → expired</li></ul>' +
      '<h4>No-results searches</h4><ul>' + links(NO_RESULT_TERMS) + '</ul>' +
      '<h4>Searches with results</h4><ul>' + links(SEARCH_TERMS) + '</ul>' +
      '<h4>Reset</h4><button class="linkish" type="button" data-clear-cart>Empty the basket</button>';
  }
  function togglePresenter() {
    let panel = document.getElementById('presenter');
    if (panel) { panel.remove(); return; }
    panel = document.createElement('aside');
    panel.className = 'presenter';
    panel.id = 'presenter';
    panel.innerHTML = presenterHtml();
    document.body.appendChild(panel);
    panel.querySelector('[data-close-presenter]').onclick = togglePresenter;
    panel.querySelector('[data-clear-cart]').onclick = function () { NF.setCart([]); NF.toast('Basket emptied'); if (NF.onCartCleared) NF.onCartCleared(); };
  }

  // ---------- Page boot ----------
  NF.boot = function (active) {
    const head = document.getElementById('site-header');
    const foot = document.getElementById('site-footer');
    if (head) head.innerHTML = headerHtml(active);
    if (foot) foot.innerHTML = footerHtml();

    // Keep Amplitude's user ID in step with the stored login
    const u = NF.getUser();
    if (u && window.amplitude && amplitude.getUserId && amplitude.getUserId() !== u.user_id) amplitude.setUserId(u.user_id);

    renderAccountButton();
    NF.renderCartCount();

    // Save buttons on any card
    document.addEventListener('click', function (e) {
      const save = e.target.closest('[data-save]');
      if (save) {
        e.preventDefault();
        const on = NF.toggleSaved(save.getAttribute('data-save'));
        document.querySelectorAll('[data-save="' + save.getAttribute('data-save') + '"]').forEach(function (b) { b.setAttribute('aria-pressed', on); });
        NF.toast(on ? 'Saved to your list' : 'Removed from your list');
        return;
      }
      const rec = e.target.closest('[data-rec-module]');
      if (rec) NF.track('Recommendation Clicked', { module_name: rec.getAttribute('data-rec-module') });
    });

    document.addEventListener('keydown', function (e) {
      const typing = /INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '');
      if (!typing && e.shiftKey && (e.key === 'D' || e.key === 'd')) togglePresenter();
    });
  };
})();
