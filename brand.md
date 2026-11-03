# Northfield & Co — brand notes

Northfield & Co is an invented mid-market general retailer used for an Amplitude
holiday-peak demo. It sells electronics, homeware, beauty, apparel, toys and gifting.
The feel is calm and trustworthy: lots of whitespace, big product areas, clear type,
and a holiday sale that's visible without shouting.

## Colour

| Token | Hex | Use |
|---|---|---|
| `--pine` | `#1F4D43` | **Primary.** Every CTA, links, focus rings, logo mark |
| `--pine-dark` | `#163A32` | CTA hover / pressed |
| `--pine-tint` | `#E6EFEC` | Selected states, info panels |
| `--paper` | `#FAF8F4` | Page background (warm off-white) |
| `--white` | `#FFFFFF` | Cards, panels |
| `--ink` | `#1C1F1E` | Body text, headings |
| `--muted` | `#5E6663` | Secondary text |
| `--line` | `#E4E0D8` | Borders, dividers |
| `--sale` | `#A63D2F` | Sale badges and sale prices only. Never a CTA |
| `--gold` | `#B8893A` | Star ratings, loyalty tier chip |

One primary colour (pine green). The sale red is a small accent and is never used for
buttons, so the sale stays tasteful.

Product image placeholders are soft two-stop gradients, one pair per category:

| Category | From | To |
|---|---|---|
| Electronics | `#DCE3EA` | `#B9C6D3` |
| Home | `#EFE6D8` | `#DCCBB1` |
| Beauty | `#F3E3E1` | `#E2C3BF` |
| Apparel | `#E3E6DD` | `#C6CDB9` |
| Toys | `#F4EBD3` | `#E6D29F` |
| Gifting | `#E9E1EC` | `#CDBCD4` |

Each placeholder carries a simple inline SVG line icon for the product type.

## Type

- **Headings:** Fraunces (Google Fonts), weights 500 and 600. Fallback `Georgia, "Times New Roman", serif`.
- **Body and UI:** Inter (Google Fonts), weights 400, 500, 600. Fallback `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Base size 16px, line height 1.55. Headings tight (1.15) with slight negative tracking.
- Prices use Inter 600 with tabular numerals.

## Shape and spacing

- Radius: 10px on cards and inputs, 999px on chips and badges, 8px on buttons.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 72px.
- Max content width 1200px, 24px side gutter (16px on phones).
- Shadows are rare and soft: `0 1px 2px rgba(28,31,30,.06)`.

## House brands

Seven own-label brands. Each product card shows its brand as a small uppercase label
above the name, because brand is a merchandising breakdown in the demo.

| Brand | Covers |
|---|---|
| Aurora | Audio and screens |
| Northfield | The house name: kitchen, basics, gifting |
| Halden | Small appliances and wearables |
| Mirren | Soft furnishings and bath |
| Lumen | Skincare and gift wrap |
| Kestrel | Knitwear and outerwear |
| Pipkin | Toys and games |

(The original brief said "six" brands but listed seven. All seven appear in the catalogue.)

## Copy register

Plain, warm, short sentences. Examples used on the site:

- "Free delivery over $50."
- "Order by 20 December for Christmas delivery."
- "Gifts they'll actually use."
- Errors are quiet: "This code cannot be applied to your basket."
