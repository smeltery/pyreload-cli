import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const output = join(root, 'website/public');
mkdirSync(join(output, 'diagrams'), { recursive: true });
for (const name of ['logo.svg', 'og-image.png'])
  copyFileSync(join(root, 'assets', name), join(output, name));
copyFileSync(join(root, 'assets/logo.svg'), join(output, 'favicon.svg'));
function render(directory: string) {
  for (const file of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, file.name);
    if (file.isDirectory()) {
      render(path);
      continue;
    }
    if (!file.name.endsWith('.md')) continue;
    for (const match of readFileSync(path, 'utf8').matchAll(
      /```mermaid\s*\n([\s\S]*?)```/g,
    )) {
      const source = match[1];
      const hash = createHash('sha256')
        .update(source)
        .digest('hex')
        .slice(0, 12);
      const target = join(output, 'diagrams', `${hash}.svg`);
      const temp = join(root, '.website-studio', 'diagrams');
      mkdirSync(temp, { recursive: true });
      const input = join(temp, `${hash}.mmd`);
      const config = join(temp, 'puppeteer.json');
      writeFileSync(input, source);
      writeFileSync(
        config,
        JSON.stringify({
          executablePath: chromium.executablePath(),
          args: ['--no-sandbox'],
        }),
      );
      execFileSync(
        join(root, 'node_modules/.bin/mmdc'),
        ['-i', input, '-o', target, '-b', 'transparent', '-p', config],
        { stdio: 'inherit' },
      );
    }
  }
}
render(join(root, 'docs/src'));
