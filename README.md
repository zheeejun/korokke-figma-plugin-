# korokke-figma

Claude Code plugin that keeps ui_korokke `ap-*` components in sync with the Figma **Components** file.

| Part | What it does |
|---|---|
| `skills/export-component-to-figma` | Builds a component in Figma from ap-components-lib, or updates an existing one in place to match the code. |
| `hooks/` | After Claude edits `src/app/components/ap-*/*.component.(html\|ts\|css)` in ui_korokke, asks Claude to sync Figma once with the skill. |

## Install

```
/plugin marketplace add zheeejun/korokke-figma-plugin-
/plugin install korokke-figma@korokke-figma-plugin
```

Needs the Figma plugin signed in, with edit access to the Components file.

## Use

- `export ap-xxx to figma` – first time
- `sync figma for ap-xxx` – after you changed code yourself
- Claude's own edits to a component trigger the sync automatically.
