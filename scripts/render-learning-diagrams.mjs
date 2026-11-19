#!/usr/bin/env node
// Build-time Mermaid rendering; visitors need neither Mermaid nor JavaScript.
// npm ci --prefix green-app; node scripts/render-learning-diagrams.mjs
// Set PUPPETEER_EXECUTABLE_PATH to use a browser other than macOS Chrome.
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require = createRequire(new URL('../green-app/package.json', import.meta.url));
const { run } = await import(require.resolve('@mermaid-js/mermaid-cli'));
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chrome = process.env.PUPPETEER_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const mermaidConfig = JSON.parse(await readFile(path.join(root, 'scripts/mermaid/config.json'), 'utf8'));
const diagrams = [
  'open-learning-framework',
  'open-learning-discovery',
  'learning-about-learning-overview',
  'learning-about-learning-instructional',
  'learning-about-learning-philosophies',
  'learning-about-learning-oakley-khan',
  'learning-about-learning-frameworks',
  'learning-about-learning-topics',
  'learning-about-learning-design-ai',
];
for (const name of diagrams) {
  await run(path.join(root, `articles/diagrams/${name}.mmd`), path.join(root, `articles/diagrams/${name}.svg`), {
    puppeteerConfig: existsSync(chrome) ? { executablePath: chrome } : {},
    parseMMDOptions: { mermaidConfig, backgroundColor: 'transparent' }
  });
}
