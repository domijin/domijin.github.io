#!/usr/bin/env node
// Regression check: withdrawn strings disappear while cached-client code still runs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'editorial-record-check-'));
try {
  const filename = path.join(dir, 'cached-client.js');
  const original = {
    title: 'A legitimate essay',
    blocks: ['Keep this paragraph.', '## Appendix — Raw prompts and source context',
      'Editorial note: seven numbered entries were supplied with this draft.',
      '<details><summary>Expand the original prompts (7 supplied entries)</summary>REFERENCE_ONLY_PAYLOAD</details>',
      'Keep this ending.'],
  };
  fs.writeFileSync(filename, `globalThis.article=${JSON.stringify(original)};globalThis.answer=6*7;`);
  execFileSync(process.execPath, [path.join(__dirname, 'scrub-editorial-record.cjs'), dir]);
  const after = fs.readFileSync(filename, 'utf8');
  assert(!after.includes('REFERENCE_ONLY_PAYLOAD'));
  const sandbox = {};
  vm.runInNewContext(after, sandbox);
  assert.equal(sandbox.answer, 42);
  assert.equal(sandbox.article.title, original.title);
  assert.deepEqual(Array.from(sandbox.article.blocks), ['Keep this paragraph.', '', '', '', 'Keep this ending.']);
  execFileSync(process.execPath, [path.join(__dirname, 'scrub-editorial-record.cjs'), dir]);
  assert.equal(fs.readFileSync(filename, 'utf8'), after);
  console.log('Passed: private record removed, other prose and cached-client code preserved, repeat is unchanged.');
} finally { fs.rmSync(dir, { recursive: true, force: true }); }
