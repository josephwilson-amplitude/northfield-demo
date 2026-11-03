/* Northfield & Co catalogue. item_id values are the join key with the Amplitude data:
   do not edit IDs, names, categories, brands, collections, sale tags or prices. */
const CATALOGUE = [
  {"item_id": "ELEC-1001", "item_name": "Aurora Noise-Cancelling Headphones", "item_category": "Electronics", "item_brand": "Aurora", "collection": "Black Friday Deals", "sale_tag": "Holiday Sale", "price": 149.0},
  {"item_id": "ELEC-1002", "item_name": "Aurora Wireless Earbuds Mini", "item_category": "Electronics", "item_brand": "Aurora", "collection": "Black Friday Deals", "sale_tag": "Holiday Sale", "price": 79.0},
  {"item_id": "ELEC-1003", "item_name": "Northfield Smart Speaker", "item_category": "Electronics", "item_brand": "Northfield", "collection": "Core Range", "sale_tag": "Full Price", "price": 59.0},
  {"item_id": "ELEC-1004", "item_name": "Aurora 4K Streaming Stick", "item_category": "Electronics", "item_brand": "Aurora", "collection": "Core Range", "sale_tag": "Full Price", "price": 44.0},
  {"item_id": "ELEC-1005", "item_name": "Halden Fitness Tracker", "item_category": "Electronics", "item_brand": "Halden", "collection": "New Arrivals", "sale_tag": "Full Price", "price": 119.0},
  {"item_id": "ELEC-1006", "item_name": "Halden Smartwatch Series 3", "item_category": "Electronics", "item_brand": "Halden", "collection": "Black Friday Deals", "sale_tag": "Holiday Sale", "price": 229.0},
  {"item_id": "ELEC-1007", "item_name": "Northfield Power Bank 20K", "item_category": "Electronics", "item_brand": "Northfield", "collection": "Core Range", "sale_tag": "Full Price", "price": 35.0},
  {"item_id": "ELEC-1008", "item_name": "Aurora Portable Projector", "item_category": "Electronics", "item_brand": "Aurora", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 299.0},
  {"item_id": "HOME-2001", "item_name": "Mirren Linen Duvet Set", "item_category": "Home", "item_brand": "Mirren", "collection": "Core Range", "sale_tag": "Full Price", "price": 89.0},
  {"item_id": "HOME-2002", "item_name": "Mirren Weighted Throw", "item_category": "Home", "item_brand": "Mirren", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 54.0},
  {"item_id": "HOME-2003", "item_name": "Northfield Cast Iron Casserole", "item_category": "Home", "item_brand": "Northfield", "collection": "Black Friday Deals", "sale_tag": "Holiday Sale", "price": 72.0},
  {"item_id": "HOME-2004", "item_name": "Northfield Knife Block Set", "item_category": "Home", "item_brand": "Northfield", "collection": "Core Range", "sale_tag": "Full Price", "price": 110.0},
  {"item_id": "HOME-2005", "item_name": "Mirren Scented Candle Trio", "item_category": "Home", "item_brand": "Mirren", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 28.0},
  {"item_id": "HOME-2006", "item_name": "Halden Coffee Grinder", "item_category": "Home", "item_brand": "Halden", "collection": "New Arrivals", "sale_tag": "Full Price", "price": 65.0},
  {"item_id": "HOME-2007", "item_name": "Northfield Stoneware Dinner Set", "item_category": "Home", "item_brand": "Northfield", "collection": "Core Range", "sale_tag": "Full Price", "price": 95.0},
  {"item_id": "HOME-2008", "item_name": "Mirren Velvet Cushion", "item_category": "Home", "item_brand": "Mirren", "collection": "Core Range", "sale_tag": "Full Price", "price": 22.0},
  {"item_id": "BEAU-3001", "item_name": "Lumen Vitamin C Serum", "item_category": "Beauty", "item_brand": "Lumen", "collection": "New Arrivals", "sale_tag": "Full Price", "price": 38.0},
  {"item_id": "BEAU-3002", "item_name": "Lumen Advent Beauty Box", "item_category": "Beauty", "item_brand": "Lumen", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 85.0},
  {"item_id": "BEAU-3003", "item_name": "Lumen Hydrating Cleanser", "item_category": "Beauty", "item_brand": "Lumen", "collection": "Core Range", "sale_tag": "Full Price", "price": 24.0},
  {"item_id": "BEAU-3004", "item_name": "Halden Hair Dryer Pro", "item_category": "Beauty", "item_brand": "Halden", "collection": "Black Friday Deals", "sale_tag": "Holiday Sale", "price": 139.0},
  {"item_id": "BEAU-3005", "item_name": "Lumen Gift Set: Calm", "item_category": "Beauty", "item_brand": "Lumen", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 45.0},
  {"item_id": "BEAU-3006", "item_name": "Mirren Bath Soak Collection", "item_category": "Beauty", "item_brand": "Mirren", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 32.0},
  {"item_id": "APPA-4001", "item_name": "Kestrel Merino Crew Jumper", "item_category": "Apparel", "item_brand": "Kestrel", "collection": "Core Range", "sale_tag": "Full Price", "price": 78.0},
  {"item_id": "APPA-4002", "item_name": "Kestrel Quilted Jacket", "item_category": "Apparel", "item_brand": "Kestrel", "collection": "Black Friday Deals", "sale_tag": "Holiday Sale", "price": 145.0},
  {"item_id": "APPA-4003", "item_name": "Kestrel Lambswool Scarf", "item_category": "Apparel", "item_brand": "Kestrel", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 36.0},
  {"item_id": "APPA-4004", "item_name": "Northfield Cotton Pyjama Set", "item_category": "Apparel", "item_brand": "Northfield", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 42.0},
  {"item_id": "APPA-4005", "item_name": "Kestrel Wool Blend Coat", "item_category": "Apparel", "item_brand": "Kestrel", "collection": "New Arrivals", "sale_tag": "Full Price", "price": 210.0},
  {"item_id": "APPA-4006", "item_name": "Northfield Thermal Socks 3pk", "item_category": "Apparel", "item_brand": "Northfield", "collection": "Core Range", "sale_tag": "Full Price", "price": 18.0},
  {"item_id": "TOYS-5001", "item_name": "Pipkin Wooden Train Set", "item_category": "Toys", "item_brand": "Pipkin", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 48.0},
  {"item_id": "TOYS-5002", "item_name": "Pipkin Build-a-Robot Kit", "item_category": "Toys", "item_brand": "Pipkin", "collection": "Black Friday Deals", "sale_tag": "Holiday Sale", "price": 34.0},
  {"item_id": "TOYS-5003", "item_name": "Pipkin Plush Bear Large", "item_category": "Toys", "item_brand": "Pipkin", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 26.0},
  {"item_id": "TOYS-5004", "item_name": "Pipkin Family Board Game", "item_category": "Toys", "item_brand": "Pipkin", "collection": "Core Range", "sale_tag": "Full Price", "price": 29.0},
  {"item_id": "TOYS-5005", "item_name": "Halden Kids Headphones", "item_category": "Toys", "item_brand": "Halden", "collection": "New Arrivals", "sale_tag": "Full Price", "price": 39.0},
  {"item_id": "GIFT-6001", "item_name": "Northfield Gift Card", "item_category": "Gifting", "item_brand": "Northfield", "collection": "Core Range", "sale_tag": "Full Price", "price": 50.0},
  {"item_id": "GIFT-6002", "item_name": "Northfield Hamper: Festive", "item_category": "Gifting", "item_brand": "Northfield", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 95.0},
  {"item_id": "GIFT-6003", "item_name": "Mirren Letterbox Gift Box", "item_category": "Gifting", "item_brand": "Mirren", "collection": "Gift Guide", "sale_tag": "Holiday Sale", "price": 38.0},
  {"item_id": "GIFT-6004", "item_name": "Lumen Luxury Gift Wrap Set", "item_category": "Gifting", "item_brand": "Lumen", "collection": "Core Range", "sale_tag": "Full Price", "price": 14.0}
];

const CATEGORIES = ["Electronics", "Home", "Beauty", "Apparel", "Toys", "Gifting"];
const COLLECTIONS = ["Black Friday Deals", "Gift Guide", "New Arrivals", "Core Range"];

// Presenter terms that return results (fire "Search Performed")
const SEARCH_TERMS = [
  "headphones", "gift for dad", "candle", "pyjamas", "coffee grinder", "smart watch",
  "duvet set", "advent calendar", "board game", "scarf", "gift card", "wool coat",
  "serum", "kids headphones", "hamper"
];

// Presenter terms that return nothing (fire "Search Returned No Results")
const NO_RESULT_TERMS = [
  "black friday doorbuster", "lightning deal", "bundle discount code",
  "aurora headphones 50% off", "half price gift set", "free delivery code"
];

// Promo codes. Every code is rejected; these are the reasons sent to Amplitude
const PROMO_REJECTIONS = {
  HOLIDAY25: "not_valid_on_sale_items",
  SAVE20: "expired",
  BLACKFRIDAY: "single_use_already_redeemed",
  WELCOME10: "minimum_spend_not_met",
  GIFT15: "expired"
};

// Display-only copy. Not sent to Amplitude
const DESCRIPTIONS = {
  "ELEC-1001": "Quiet the commute. Adaptive noise cancelling, 30 hours of battery and soft memory-foam cushions.",
  "ELEC-1002": "Small, light and easy to forget you're wearing. Pocket-sized case with 24 hours of charge.",
  "ELEC-1003": "Room-filling sound with a warm fabric finish. Works with the voice assistant you already use.",
  "ELEC-1004": "Plug into any TV for 4K streaming. Simple remote, fast set-up.",
  "ELEC-1005": "Steps, sleep and heart rate on a slim band. A week of battery on one charge.",
  "ELEC-1006": "A bright always-on display, GPS and swim tracking. Our best-selling watch, now in the sale.",
  "ELEC-1007": "Charges a phone four times over. Two USB-C ports for sharing.",
  "ELEC-1008": "Film night anywhere. Throws a 100-inch picture onto any wall.",
  "HOME-2001": "Stonewashed linen that gets softer with every wash. Duvet cover and two pillowcases.",
  "HOME-2002": "Gentle, even weight for winding down. Machine-washable cover.",
  "HOME-2003": "Enamelled cast iron for slow stews and fresh bread. Oven safe to 250°C.",
  "HOME-2004": "Five forged knives and a solid oak block. Made to last.",
  "HOME-2005": "Fig, cedar and winter orange. Three hand-poured candles in a gift box.",
  "HOME-2006": "Burr grinder with 30 settings, from espresso to cafetière.",
  "HOME-2007": "Twelve pieces in a calm speckled glaze. Dishwasher and microwave safe.",
  "HOME-2008": "Soft cotton velvet with a feather-blend pad. Five winter shades.",
  "BEAU-3001": "A daily brightening serum with 15% vitamin C. Light and quick to absorb.",
  "BEAU-3002": "Twenty-four days of skincare favourites, from full sizes to minis.",
  "BEAU-3003": "A gentle gel cleanser that leaves skin comfortable, never tight.",
  "BEAU-3004": "Fast drying with less heat. Three attachments and a cool-shot button.",
  "BEAU-3005": "Lavender body wash, lotion and pillow mist. Gift-boxed and ready to give.",
  "BEAU-3006": "Mineral salts and oils for a long, quiet soak. Four scents.",
  "APPA-4001": "Fine merino that's warm without the bulk. A jumper for every season.",
  "APPA-4002": "Lightweight quilting with a recycled fill. Packs into its own pocket.",
  "APPA-4003": "Soft lambswool woven in Scotland. Six colours.",
  "APPA-4004": "Brushed cotton pyjamas with piped edges. Gift-boxed.",
  "APPA-4005": "A clean-lined coat in a warm wool blend. Fully lined.",
  "APPA-4006": "Three pairs of cushioned thermal socks for cold mornings.",
  "TOYS-5001": "Beech-wood engine, carriages and track. For ages 3 and up.",
  "TOYS-5002": "Build, wire and program your own robot. For ages 8 and up.",
  "TOYS-5003": "A big, huggable bear in soft recycled plush.",
  "TOYS-5004": "Quick to learn, hard to stop playing. Two to six players.",
  "TOYS-5005": "Volume-limited headphones made for small ears.",
  "GIFT-6001": "Let them choose. Delivered in a card with a hand-written message.",
  "GIFT-6002": "Chutneys, crackers, chocolate and a bottle of sparkling juice in a wicker basket.",
  "GIFT-6003": "A little box of treats that fits through the letterbox.",
  "GIFT-6004": "Recycled paper, ribbon and tags in three patterns."
};
