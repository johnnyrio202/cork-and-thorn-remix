# Cork & Thorn Remix

Next.js 16 + Tailwind v4 rebuild of the Cork & Thorn (Las Vegas bar/lounge)
public site, for the cxc-agency client engagement.

## Origin

This is a from-scratch reconstruction of a v0-generated redesign
(`cork-and-thorn-ui-v0-iabo5iewb-cxc-agency.vercel.app`), built because
GitHub access to the actual source repo
(`genothecxc/cork-and-thorn-ui-v0-cxc`) wasn't available yet. Pages,
copy, and menu data were harvested directly from the live SSO-protected
preview via an authenticated browser session; the design (colors, type,
layout patterns) was reproduced by eye from screenshots, not pixel-perfect
copied from source code.

**Once GitHub access to the real repo lands**, treat that as the source of
truth for the actual v0 design system/components, and reconcile this repo
against it (or replace it outright) rather than continuing to build out
this reconstruction indefinitely.

The original scraped content/reference material lives in the sibling repo
`/Users/riomain/corkandthorn-clone` — a full mirror of the *old* live
corkandthorn.com (SpotHopper platform) site, kept separate and untouched
in case the client wants to reuse any of that copy/imagery.

## Status

Frontend-only, no backend — matches the state of the source v0 design.
All forms (reservations, private-parties inquiry, shop checkout,
newsletter) are visual only; nothing submits anywhere yet.

Routes: `/` `/menu` `/reservations` (`/events` redirects here)
`/shop` `/private-parties` `/loyalty` (placeholder — real "Inner Circle"
page 404s in the source design too).

## Known gaps vs. the source design

- Logo: using a text wordmark in the nav, not the real 3D chrome logo
  image — the harvested asset (`public/images/logo-3d-chrome.jpg`) is a
  screenshot with a baked-in light background, not a transparent PNG.
  Swap in the real asset once repo access lands.
- Several long spirits sub-lists (Tequila & Mezcal, Whiskey & Bourbon,
  Liqueurs) may be missing their last 1-6 items — output got truncated
  during harvesting. See `/Users/riomain/corkandthorn-clone/content/v0-menu-full.md`
  for the harvest notes.
- Interactive floor plan is a static zone/table listing, not the
  original's clickable seat-map with reserved/available states.
- No exact type/spacing/gradient matching to the source — this was
  reproduced by eye, not from real CSS.

## Next steps (per user direction)

Backend work is next: wiring reservations/deposits/floor-plan to
NightOps (`/Users/riomain/nightops`) — but NOT until NightOps' M5 is done
and its Clover payment gateway is real (currently a stub with fake data).
See memory `project_corkthorn_remix` and `project_nightops` for full
context.

## Development

```bash
npm run dev      # local dev server
npm run build    # production build
```
