#!/usr/bin/env node
// Build-time Mermaid rendering; visitors need neither Mermaid nor JavaScript.
// npm ci --prefix green-app; node scripts/render-learning-diagrams.mjs
// Set PUPPETEER_EXECUTABLE_PATH to use a browser other than macOS Chrome.
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
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
  'learning-about-learning-overview-zh',
  'learning-about-learning-instructional-zh',
  'learning-about-learning-philosophies-zh',
  'learning-about-learning-oakley-khan-zh',
  'learning-about-learning-frameworks-zh',
  'learning-about-learning-topics-zh',
  'learning-about-learning-design-ai-zh',
];
for (const name of diagrams) {
  const output = path.join(root, `articles/diagrams/${name}.svg`);
  await run(path.join(root, `articles/diagrams/${name}.mmd`), output, {
    puppeteerConfig: existsSync(chrome) ? { executablePath: chrome } : {},
    parseMMDOptions: { mermaidConfig, backgroundColor: 'transparent' }
  });
  // Mermaid mind maps repeat the group ID on its background and emit identical gradients.
  const svg = await readFile(output, 'utf8');
  const gradients = new Set();
  const unique = svg.replace(/(<g [^<>]* id="([^"]+)"[^<>]*><path) id="\2"/g, '$1')
    .replace(/<linearGradient\b[^>]*>[\s\S]*?<\/linearGradient>/g, gradient => {
      if (gradients.has(gradient)) return '';
      gradients.add(gradient);
      return gradient;
    });
  if (unique !== svg) await writeFile(output, unique);
}
