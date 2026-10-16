import { createHash } from 'node:crypto';
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
  mkdirSync,
  existsSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8' },
).split('\0');
const temp = mkdtempSync(join(tmpdir(), 'pyreload-mermaid-'));
const update = process.argv.includes('--write');
if (update) mkdirSync('assets/diagrams', { recursive: true });
let count = 0;
try {
  writeFileSync(
    join(temp, 'puppeteer.json'),
    JSON.stringify({
      executablePath: chromium.executablePath(),
      args: ['--no-sandbox'],
    }),
  );
  for (const file of new Set(files.filter((name) => name.endsWith('.md')))) {
    let source;
    try {
      source = readFileSync(file, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    for (const match of source.matchAll(/```mermaid\s*\n([\s\S]*?)```/g)) {
      const input = join(temp, `${count++}.mmd`);
      const hash = createHash('sha256')
        .update(match[1])
        .digest('hex')
        .slice(0, 12);
      const asset = join('assets/diagrams', `${hash}.svg`);
      if (file.startsWith('docs/src/') && !update && !existsSync(asset)) {
        throw new Error(
          `Missing diagram asset for ${file}. Run bun run diagrams:update.`,
        );
      }
      writeFileSync(input, match[1]);
      console.log(`Rendering diagram in ${file}`);
      execFileSync(
        'node_modules/.bin/mmdc',
        [
          '-i',
          input,
          '-o',
          update && file.startsWith('docs/src/') ? asset : `${input}.svg`,
          '-b',
          'transparent',
          '-p',
          join(temp, 'puppeteer.json'),
        ],
        { stdio: 'inherit' },
      );
    }
  }
  if (!count) throw new Error('No Mermaid diagrams found');
  console.log(`Validated ${count} Mermaid diagrams`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
