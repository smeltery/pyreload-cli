import { createHash } from 'node:crypto';
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  copyFileSync,
  existsSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const output = join(root, 'website/public');
mkdirSync(join(output, 'diagrams'), { recursive: true });
for (const name of ['logo.svg', 'og-image.png'])
  copyFileSync(join(root, 'assets', name), join(output, name));
copyFileSync(join(root, 'assets/logo.svg'), join(output, 'favicon.svg'));
function copyDiagrams(directory: string) {
  for (const file of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, file.name);
    if (file.isDirectory()) {
      copyDiagrams(path);
      continue;
    }
    if (!file.name.endsWith('.md')) continue;
    for (const match of readFileSync(path, 'utf8').matchAll(
      /```mermaid\s*\n([\s\S]*?)```/g,
    )) {
      const hash = createHash('sha256')
        .update(match[1])
        .digest('hex')
        .slice(0, 12);
      const asset = join(root, 'assets/diagrams', `${hash}.svg`);
      if (!existsSync(asset))
        throw new Error(
          `Diagram in ${path} changed. Run bun run diagrams:update from the repository root.`,
        );
      copyFileSync(asset, join(output, 'diagrams', `${hash}.svg`));
    }
  }
}
copyDiagrams(join(root, 'docs/src'));
