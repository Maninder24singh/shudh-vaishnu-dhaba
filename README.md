# Shudh Vaishnu Dhaba — Website Redesign

A custom-built, editorial-style redesign of the Shudh Vaishnu Dhaba restaurant site (Surrey, BC), built as a pitch to replace their existing WordPress/Elementor site.

- **Live site:** https://maninder24singh.github.io/shudh-vaishnu-dhaba/
- **Repo:** https://github.com/Maninder24singh/shudh-vaishnu-dhaba
- **Original site (for reference):** https://shudhvaishnudhaba.com

## Stack

Plain HTML / CSS / JS — no framework, no build step. Portable to any static host (GitHub Pages, Netlify, Vercel, or the restaurant's existing hosting).

```
index.html
assets/
  css/style.css
  js/main.js
  img/            # all photography (see Image sources below)
```

## Design direction

Moved off the generic light/lavender WordPress-template look toward a dark, premium, editorial aesthetic:

- **Palette:** charcoal/near-black base, ghee-gold accent, ember-red secondary accent, cream text
- **Type:** Fraunces (display serif) + Inter (body sans), via Google Fonts
- **Motion:** scroll-reveal on every section, Ken Burns hero zoom, scrolling marquee ticker, sliding-pill menu tabs, cursor-reactive 3D tilt on cards, button shine-sweep on hover, ambient cursor glow (desktop only, respects `prefers-reduced-motion` and touch devices)
- **Live data touches:** "Open Now / Closed" status and today's-row highlight in the hours table are computed from the visitor's clock, not hardcoded

## Sections

Home (hero) → Philosophy → Menu (tabbed, 5 categories) → Values (stats + guarantee cards) → Gallery (lightbox) → Catering banner → Community/reviews → Visit (storefront photo, address, live hours, Google Map embed)

## Image sources

| Image | Source | Status |
|---|---|---|
| Food photography (dishes, thali, milkshake, spices, chapati/ghee shot) | Downloaded from the restaurant's own current website (`shudhvaishnudhaba.com/wp-content/uploads/...`) | Safe — restaurant's own published content |
| `interior-dining-room.jpg` (booth seating, used in Menu section banner) | Google Maps listing photo | ⚠️ Credited to a customer/Local Guide ("Ananthakrishnan Rajasekharan Pillai"), **not** the restaurant owner. Used here as a placeholder for the pitch. **Replace before this goes live for real** — ask the owner for their own interior shot, or get explicit permission. |
| `storefront-exterior.jpg` (used in Visit section banner) | Provided directly by the user (downloaded from the owner's own Google listing / taken personally) | Safe — user-supplied, cropped and color-corrected (removed foreground car clutter, boosted contrast/saturation) |
| `logo.jpg` | Restaurant's own site | Safe |

## Known placeholders — replace before real launch

- **Menu prices** — all sample/illustrative, not the restaurant's real POS pricing. Flagged inline in `index.html` with a visible note under the menu.
- **Customer reviews** (Community section) — sample copy, not real reviews. Flagged inline with a visible note. Swap in real Google/social reviews.
- **Interior photo** — see Image sources table above.
- **Hours discrepancy** — the restaurant's own website states 10:30 AM–3:00 AM daily, but their live Google Maps listing showed "Closed · Opens 12 p.m." at time of writing. Worth confirming actual hours with the owner before launch — the site currently follows the website's stated hours.

## Updating the site

The repo auto-deploys via GitHub Pages on every push to `master`:

```bash
git add .
git commit -m "describe the change"
git push
```

Changes go live within ~1–2 minutes, no manual rebuild step.

## Next steps

- Get more real photography from the owner (interior, staff/kitchen action, more dish close-ups)
- Replace placeholder prices and reviews with real data
- Point the restaurant's existing domain (`shudhvaishnudhaba.com`) at this GitHub Pages deployment via DNS, once approved
