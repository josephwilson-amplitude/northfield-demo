/* Home page */
(function () {
  NF.boot('home');

  NF.track('Home Page Viewed', { page_path: NF.sitePath(), is_sale_live: true });

  // Hero: headphones, discovery_method "homepage_hero"
  const heroItem = NF.byId('ELEC-1001');
  const heroUrl = NF.productUrl(heroItem, 'homepage_hero', { pos: 1 });
  document.getElementById('hero-cta').href = heroUrl;
  const feature = document.getElementById('hero-feature');
  feature.href = heroUrl;
  feature.innerHTML = NF.art('Electronics') +
    '<div class="hero-caption"><div><div class="brand-label">' + heroItem.item_brand + '</div><strong>' + heroItem.item_name + '</strong></div>' +
    '<div><span class="price sale">' + NF.money(heroItem.price) + '</span> <span class="was">' + NF.money(NF.wasPrice(heroItem)) + '</span></div></div>';

  // Mid-page promo tile: smartwatch, discovery_method "promo_banner"
  document.getElementById('promo-tile').href = NF.productUrl(NF.byId('ELEC-1006'), 'promo_banner', { pos: 1 });

  // Recommended for you: discovery_method "recommendation"
  const recIds = ['HOME-2006', 'APPA-4001', 'BEAU-3001', 'ELEC-1003'];
  document.getElementById('home-recs').innerHTML = recIds.map(function (id, i) {
    return NF.card(NF.byId(id), { via: 'recommendation', pos: i + 1, module: 'Recommended for you' });
  }).join('');

  // Gift Guide row: discovery_method "gift_guide"
  const giftIds = ['BEAU-3002', 'HOME-2005', 'TOYS-5001', 'GIFT-6002'];
  document.getElementById('home-gifts').innerHTML = giftIds.map(function (id, i) {
    return NF.card(NF.byId(id), { via: 'gift_guide', pos: i + 1 });
  }).join('');

  document.getElementById('home-tiles').innerHTML = CATEGORIES.map(function (c) {
    return '<a class="tile" href="' + NF.categoryUrl(c) + '">' + NF.art(c) + '<span>' + c + '</span></a>';
  }).join('');

  NF.observePromos();
})();
