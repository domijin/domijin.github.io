#!/usr/bin/env node
/** Remove the withdrawn Open Learning prompt appendix from retained client bundles.
 * Keep asset names and executable code intact for browsers holding older HTML.
 * Only the three known editorial-record string literals are replaced; no eval.
 */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('../green-app/node_modules/typescript');
const markers = [
  'Expand the original prompts (7 supplied entries)',
  'seven numbered entries were supplied with this draft',
  '## Appendix — Raw prompts and source context',
];
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const name = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(name) : name.endsWith('.js') ? [name] : [];
  });
}
let count = 0;
for (const root of process.argv.slice(2)) {
  for (const filename of walk(root)) {
    const original = fs.readFileSync(filename, 'utf8');
    if (!markers.some(m => original.includes(m))) continue;
    const source = ts.createSourceFile(filename, original, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    const edits = [];
    const visit = node => {
      if (ts.isStringLiteral(node) && markers.some(m => node.text.includes(m))) {
        edits.push([node.getStart(source), node.end]);
      } else ts.forEachChild(node, visit);
    };
    visit(source);
    let result = original;
    for (const [start, end] of edits.sort((a, b) => b[0] - a[0])) {
      result = result.slice(0, start) + '""' + result.slice(end);
    }
    if (markers.some(m => result.includes(m))) throw new Error(`Unremoved editorial record in ${filename}`);
    const checked = ts.createSourceFile(filename, result, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    if (checked.parseDiagnostics.length > source.parseDiagnostics.length) throw new Error(`Invalid rewritten JS: ${filename}`);
    fs.writeFileSync(filename, result);
    count++;
  }
}
console.log(`Removed withdrawn editorial records from ${count} retained bundle(s).`);
