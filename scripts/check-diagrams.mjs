import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8' },
).split('\0');
const temp = mkdtempSync(join(tmpdir(), 'pyreload-mermaid-'));
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
      writeFileSync(input, match[1]);
      console.log(`Rendering diagram in ${file}`);
      execFileSync(
        'node_modules/.bin/mmdc',
        ['-i', input, '-o', `${input}.svg`, '-p', join(temp, 'puppeteer.json')],
        { stdio: 'inherit' },
      );
    }
  }
  if (!count) throw new Error('No Mermaid diagrams found');
  console.log(`Validated ${count} Mermaid diagrams`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
