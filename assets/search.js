/* Search results page. Matching lives in NF.search (app.js). */
(function () {
  NF.boot('search');
  const main = document.getElementById('search-main');
  const q = (NF.param('q') || '').trim();
  const search = NF.search;

  const popular = '<div class="filters">' + SEARCH_TERMS.slice(0, 8).map(function (t) {
    return '<a class="chip" href="search.html?q=' + encodeURIComponent(t) + '" style="text-decoration:none">' + NF.esc(t) + '</a>';
  }).join('') + '</div>';

  if (!q) {
    main.innerHTML = '<div class="page-head"><h1>Search</h1><p class="muted">Popular right now:</p>' + popular + '</div>';
    return;
  }
  document.title = 'Search: ' + q + ' — Northfield & Co';
  const results = search(q);

  if (results.length) {
    NF.track('Search Performed', { search_term: q, results_count: results.length });
    main.innerHTML = '<div class="page-head"><div class="crumbs"><a href="index.html">Home</a> / Search</div>' +
      '<h1>Results for “' + NF.esc(q) + '”</h1><p class="muted">' + results.length + (results.length === 1 ? ' product' : ' products') + '</p></div>' +
      '<div class="grid">' + results.map(function (p, i) { return NF.card(p, { via: 'search', pos: i + 1, q: q }); }).join('') + '</div>';
  } else {
    NF.track('Search Returned No Results', { search_term: q, results_count: 0, suggestion_shown: true });
    main.innerHTML = '<div class="page-head"><div class="crumbs"><a href="index.html">Home</a> / Search</div>' +
      '<h1>No matches for “' + NF.esc(q) + '”</h1><p class="muted">Check the spelling, or try a broader word. These might help:</p></div>' +
      '<h3>Shop by department</h3><div class="tiles" style="margin-bottom:32px">' +
      CATEGORIES.map(function (c) { return '<a class="tile" href="' + NF.categoryUrl(c) + '">' + NF.art(c) + '<span>' + c + '</span></a>'; }).join('') +
      '</div><h3>Collections</h3><div class="filters">' +
      COLLECTIONS.map(function (c) { return '<a class="chip" href="' + NF.collectionUrl(c) + '" style="text-decoration:none">' + c + '</a>'; }).join('') +
      '</div><h3 style="margin-top:20px">Popular searches</h3>' + popular;
  }
  NF.observePromos();
})();
