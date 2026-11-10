---
name: export-component-to-figma
description: Export an Angular component from the ui_korokke repo (src/app/components/ap-*) into the team's Figma "Components" file (fileKey x0yURGG3vM0bRRVJdwTrLg), rebuilt from ap-components-lib library instances (Button (Core), AP Toast (Core), icons, palette variables) — one page per component, with a reusable component plus a 390×844 mobile preview frame. Use whenever the user says "export to figma", "push this component to Figma", "build ap-xxx in Figma", "add this to the Components file", or pastes a figma.com/design/x0yURGG3vM0bRRVJdwTrLg link while working in a ui_korokke component folder — even if they don't name the library.
---

# Export a ui_korokke component to Figma

Recreates an Angular `ap-*` component as editable Figma layers in the
**Components** file, reusing the published **ap-components-lib** library so the
result stays linked to the design system. Never paste a screenshot of the UI as
the deliverable.

Load `figma:figma-generate-design` and `figma:figma-use` first (both are
mandatory before `use_figma`) and pass `skillNames: "figma-use,figma-generate-design"`
on every `use_figma` call.

## 1. Read the source

In the component folder read `*.component.html` and `*.component.ts`. Note:
- which `ap-*` library children are used (`ap-button`, `ap-toast`, …) and their
  inputs: `variant`, `size` (default `medium`), `accentColor`, `icon`, label text
  (use the i18n fallback string, e.g. `'WATCH AGAIN'`);
- layout classes (Tailwind: `gap-6` = 24px, `p-2` = 8px, `mb-2` = 8px, …);
- boolean `input()`s that toggle sections (`showX`) — these become component
  BOOLEAN properties.

Library sources live in `src/ap-components-lib/<name>/`. Icon names map to SVGs
in `ap-icon/utility-icons.ts` (`"link default"` → icon `link`, style `default`).

## 2. Find the target page

Parse the URL: `node-id=98-80` → `98:80`. `create_session` with the file key,
then `get_metadata` on that node. The file convention is **one page per
component, named after the selector** (e.g. `ap-history-popup-replay`). If the
target is an unnamed empty page (`Page 24`), build there and offer to rename it.
If the page already has content, place new nodes to the right of existing ones.

## 3. Resolve library assets

One batched `search_design_system` call, scoped to ap-components-lib
(`lk-67b0dc1ca32a48cda094c979d83e0c736aa8b39b3a3d8c5dccc869d6a8b5ae1a52c6d41ed5230a3e50ebdfada92c1d9a514e3601f6d273424fe4ea7e78b6abcd`),
with one query per needed component / icon / color. Known keys as of 2026-10
(verify they still import; re-search if one fails):

| Asset | Key | Notes |
|---|---|---|
| Button (Core) set | `6b38c6644471abbc76093acd77ac408b3438dde2` | Same set the sibling pages use. Variant names like `Variant=Content-Outlined, Size=Medium, AccentColor=Zinc` |
| AP Toast (Core) set | `08c7a2885284b7fb4649d6d3625c48c31f41f84a` | `AccentColor=zinc, Theme=Dark` |
| icon `play` | `12ef7d5434b924aba9dccc804728c255f75cf454` | |
| icon `link` | `1926470218b489a90d212fee21e68c958c0a097d` | |
| `palette/zinc/950` | `9fff79155791d73e1cfb8cf0d5130ad390aa8948` | preview background |

Code → Figma variant mapping for buttons: `outlined` → `Content-Outlined`,
`outlined-rounded` → `Rounded-outlined`, `content` → `Content`,
`content-rounded` → `Rounded`, `raised` → `Raised`, `text` → `Text`;
`accentColor` capitalised (`orange-dark` → `Orange-d`); `size` capitalised
(`x-small` → `X-Small`).

Icons not in the library: import the SVG from `utility-icons.ts` with
`figma.createNodeFromSvg` (add `width`/`height`, replace `currentColor`).

## 4. Build (one `use_figma` call)

Build a **COMPONENT** named after the selector, then a **390×844 preview frame**
of the same name beside it (component at x 0, frame at component width + 120),
matching the sibling `ap-history-popup-replay` page.

Gotchas learned the hard way:
- **Button (Core) has no TEXT property for the label.** Set the label on the
  inner TEXT node directly.
- **Library text uses mixed fonts** — `t.fontName` is `figma.mixed` and
  `loadFontAsync(t.fontName)` throws "Cannot unwrap symbol". Load every font
  from `t.getStyledTextSegments(['fontName'])` before setting `characters`.
- Button props: `left-icon#92:0`, `right-icon#92:198`, `Show Label#97:396`.
  Swap the icon via the nested instance: `b.findChildren(n => n.type === 'INSTANCE')[0].swapComponent(iconComponent)`.
- Absolutely positioned elements (e.g. a toast `absolute bottom-full mb-2`):
  wrap the anchor in an auto-layout frame with `clipsContent = false`, append the
  child, then `layoutPositioning = 'ABSOLUTE'` and set `x`/`y` (y = −(h + gap)).
  Set `clipsContent = false` on the component too.
- **Swapped icons keep the old icon's colour.** After `swapComponent`, copy the
  fills from the variant's default icon vector onto the new icon's vectors —
  otherwise e.g. a chevron on the White button renders white-on-white.
- **Popups** (`ap-ui-frame-popup` in the template): follow the
  `ap-history-popup-replay` page. Build only the body as a COMPONENT named
  `<selector>/content` (352 wide, copy fills from `81:63`), and in the preview
  frame copy the black background + 60% `overlay` rectangle from `81:613`, then
  add a local `ap-ui-frame-popup` instance (set `9:296`, variant
  `Breakpoint=Mobile, Accent=default, Size=mobile`) with props `header#9:3`,
  `enableClose#9:4`, `enableBack#9:5`, `content#26:0` = the content component id.
- Repeated items (share channels, list rows): one local component with TEXT +
  INSTANCE_SWAP properties, then instances.
- Images that aren't in the library (e.g. `assets/images/*.svg`): import with
  `createNodeFromSvg` and wrap with `figma.createComponentFromNode`, noting in
  its description that it's not in ap-components-lib yet.
- Responsive classes (`hidden sm:block`): build the mobile state as the
  default, expose the hidden parts as a BOOLEAN property, and place a second
  instance at 768 wide with it turned on. If the content doesn't fit at 390,
  don't fake it — let it clip and tell the user.
- No page link given → create a page named after the selector (reuse it if it
  already exists). Several components → one `use_figma` call per page, all in
  parallel.
- Expose each `showX` input as `comp.addComponentProperty('showX', 'BOOLEAN', true)`
  and bind with `node.componentPropertyReferences = { visible: propKey }`.
  Add one for transient UI (toasts) so designers can hide it.
- Set `comp.description` to what it is and which Angular component it maps to.
- If a script fails partway, the page may hold leftovers: at the start of a
  retry on a page that was empty, remove its children first (report what was removed).

End the script with `await comp.screenshot({ scale: 2 })` and
`await frame.screenshot()` and return the created IDs and sizes.

## 5. Report

Check the screenshots for clipped text, wrong variants, leftover placeholder
labels ("Zinc", "Message"). Then tell the user, briefly: the page, a link to the
component (`…?node-id=<compId with - instead of :>`), what was built, which
library assets it uses, and the component properties. Offer renaming an
unnamed page.
