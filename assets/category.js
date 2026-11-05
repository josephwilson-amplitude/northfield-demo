/* Category and collection landing pages: category.html?category=Home, ?collection=Gift%20Guide or ?collection=deals */
(function () {
  const category = NF.param('category');
  const collection = NF.collectionFromParam(NF.param('collection'));
  const name = CATEGORIES.indexOf(category) >= 0 ? category : collection;
  NF.boot(name);

  const main = document.getElementById('category-main');
  if (!name) {
    main.innerHTML = '<div class="empty"><h1>We couldn\'t find that page</h1><p class="muted">Try one of our departments instead.</p><p><a class="btn" href="index.html">Back to the home page</a></p></div>';
    return;
  }

  const isCollection = !!(collection && name === collection);
  const items = CATALOGUE.filter(function (p) { return isCollection ? p.collection === name : p.item_category === name; });
  // Products opened from the Gift Guide count as gift_guide; every other listing is category_browse
  const via = name === 'Gift Guide' ? 'gift_guide' : 'category_browse';
  const intros = {
    'Black Friday Deals': 'Our best savings, all in one place, while stocks last.',
    'Gift Guide': 'Ideas for everyone on your list, from stocking fillers to the big one.',
    'New Arrivals': 'Just landed for winter.',
    'Core Range': 'The everyday things we always keep in stock.'
  };
  const label = isCollection ? NF.collectionLabel(name) : name;   // what shoppers see; `name` is what Amplitude gets
  document.title = label + ' — Northfield & Co';

  const brands = Array.from(new Set(items.map(function (p) { return p.item_brand; }))).sort();
  const state = { brand: null, saleOnly: false };

  main.innerHTML = '<div class="page-head"><div class="crumbs"><a href="index.html">Home</a> / ' + NF.esc(label) + '</div>' +
    '<h1>' + NF.esc(label) + '</h1><p class="muted">' + NF.esc(intros[name] || 'Free delivery over $50. Order by 20 December for Christmas delivery.') + '</p></div>' +
    '<div class="filters" id="filters"></div><p class="small muted" id="count"></p><div class="grid" id="grid"></div>';

  function renderFilters() {
    const chips = ['<button class="chip" type="button" data-brand="" aria-pressed="' + (!state.brand) + '">All brands</button>']
      .concat(brands.map(function (b) { return '<button class="chip" type="button" data-brand="' + b + '" aria-pressed="' + (state.brand === b) + '">' + b + '</button>'; }));
    if (items.some(NF.isSale) && items.some(function (p) { return !NF.isSale(p); })) {
      chips.push('<button class="chip" type="button" data-sale aria-pressed="' + state.saleOnly + '">Sale only</button>');
    }
    document.getElementById('filters').innerHTML = chips.join('');
  }

  function render() {
    const visible = items.filter(function (p) {
      return (!state.brand || p.item_brand === state.brand) && (!state.saleOnly || NF.isSale(p));
    });
    document.getElementById('count').textContent = visible.length + (visible.length === 1 ? ' product' : ' products');
    document.getElementById('grid').innerHTML = visible.map(function (p, i) { return NF.card(p, { via: via, pos: i + 1 }); }).join('');
    return visible.length;
  }

  function browsed() {
    const count = render();
    NF.track('Category Browsed', {
      category_name: name,
      items_visible: count,
      filter_used: !!(state.brand || state.saleOnly)
    });
  }

  document.getElementById('filters').addEventListener('click', function (e) {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    if (chip.hasAttribute('data-sale')) state.saleOnly = !state.saleOnly;
    else state.brand = chip.getAttribute('data-brand') || null;
    renderFilters();
    browsed();
  });

  renderFilters();
  browsed();
  NF.observePromos();
})();
