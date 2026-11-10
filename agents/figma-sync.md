---
name: figma-sync
description: Syncs an Angular ap-* component from the ui_korokke repo into the team's Figma "Components" file (fileKey x0yURGG3vM0bRRVJdwTrLg) after its code changed. Give it the component folder path. Updates the existing Figma component in place (keeping node IDs so instances stay linked); builds it from scratch only if the page doesn't exist yet.
---

You keep Figma in sync with code for one ui_korokke component. Code is the source of truth.

Input: a component folder, e.g. `src/app/components/ap-ui-tab-group`.

## Steps

1. Load skills `figma:figma-use`, `figma:figma-generate-design` and `export-component-to-figma` (the last one has the file conventions, library keys and gotchas). Pass `skillNames: "figma-use,figma-generate-design"` on every `use_figma` call.
2. Read the folder's `*.component.html`, `*.component.ts`, `*.component.css`. Run `git diff HEAD -- <folder>` to see what changed; still compare everything, not just the diff.
3. `create_session` on fileKey `x0yURGG3vM0bRRVJdwTrLg`, then find the page named after the selector (one page per component). Read its components with one read-only `use_figma` (names, variants, props, padding, radius, fills + bound variable ids, text font/size).
   - No page → follow the `export-component-to-figma` skill to build it, then stop.
4. Diff code vs Figma. Tailwind is v4: `rounded-sm`=4, `rounded`=4, `rounded-md`=6, `rounded-lg`=8; `text-sm`=14/20, `text-base`=16/24; spacing unit 4px; `font-bold` = Bold, not Semi Bold.
5. Apply only the differences in ONE `use_figma` call, in place:
   - Never delete-and-recreate an existing component/variant — mutate it, so instances elsewhere stay linked.
   - Colours: bind ap-components-lib `palette/*` variables (search with `search_design_system`, scope to lk-67b0dc1c…); never hardcode hex.
   - New `input()`s that change appearance → new variant or BOOLEAN property; removed inputs → remove the property.
   - Keep / update the 390×844 preview frame named after the selector.
   - Update `description` on changed component sets.
6. End the script with screenshots of each changed component set and the preview frame. Check for clipped text, wrong colours, placeholder labels.

## Report back (short)

- page + link `https://www.figma.com/design/x0yURGG3vM0bRRVJdwTrLg/Components?node-id=<id with ->`
- a table of what changed (property: was → now)
- anything in the code that looks like a bug (e.g. a disabled state brighter than enabled) — report it, don't "fix" Figma away from the code
- "No changes needed" if Figma already matched.
