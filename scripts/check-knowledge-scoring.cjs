#!/usr/bin/env node
// Run with node scripts/check-knowledge-scoring.cjs after npm ci in green-app.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('../green-app/node_modules/typescript');

const cache = new Map();
function load(name) {
  const file = path.resolve(__dirname, '../green-app/src', name.replace(/^@\//, ''));
  if (cache.has(file)) return cache.get(file);
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const module = { exports: {} };
  cache.set(file, module.exports);
  const js = ts.transpileModule(fs.readFileSync(file + '.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(js, { module, exports: module.exports, require: load });
  return module.exports;
}

const { topNode, scoreNodes } = load('@/lib/knowledgeScoring');
const { formulateApproach } = load('@/lib/knowledgeApproach');

// Browser regression: "xylophone zucchini" produced a faint semantic neighbour.
const weak = { id: 'siren', label: 'LISA standard siren', weight: 0.08, semantic: 0.165, lexical: 0 };
assert.equal(topNode([weak]), null);
assert.equal(topNode([]), null);
assert.equal(topNode(scoreNodes('purple marmalade kazoo')), null);
assert.equal(topNode(scoreNodes('traffic light countdown')).id, 'signal');
assert.equal(topNode(scoreNodes('gravitational wave standard siren')).id, 'siren');
assert.equal(topNode([{ ...weak, semantic: 0.4, weight: 0.5 }]).id, 'siren');

// A weak neighbour must not hide a lower-scored but exact lexical match.
const lexical = { id: 'signal', label: 'Signal cycle estimation', weight: 0.16, semantic: 0, lexical: 0.5 };
assert.equal(topNode([{ ...weak, semantic: 0.23, weight: 0.19 }, lexical]).id, 'signal');

const prompt = 'How many sources are in the latest catalogue?';
assert.equal(formulateApproach(prompt, true, false, false).missing.length, 2);
assert.equal(formulateApproach(prompt, true, true, false).missing.length, 1);
assert.equal(formulateApproach(prompt, true, true, true).missing.length, 0);
console.log('10 knowledge-matching and workflow regressions passed.');
