// PostToolUse hook: after Claude edits an ap-* component in ui_korokke, remind it to sync Figma via the skill.
// Only fires inside a ui_korokke checkout (detected by src/ap-components-lib next to src/app).
const fs = require('fs');
let s = '';
process.stdin.on('data', d => (s += d)).on('end', () => {
  try {
    const f = (JSON.parse(s).tool_input?.file_path || '').replace(/\\/g, '/');
    const m = f.match(/^(.*)\/src\/app\/components\/(ap-[^/]+)\/[^/]+\.component\.(html|ts|css)$/);
    if (!m || !fs.existsSync(`${m[1]}/src/ap-components-lib`)) return;
    const folder = `${m[1]}/src/app/components/${m[2]}`;
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: `Component ${m[2]} changed. When you are done editing it (not after every single edit), sync Figma once using the export-component-to-figma skill (section 6, update) for the folder ${folder}.`,
      },
    }));
  } catch {
    // never block an edit because of this hint
  }
});
