import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { docSlugs } from '../website/app/lib/docs';
import { href } from '../website/app/lib/paths';
// Preserve the original MkDocs topic URLs on static GitHub Pages hosting.
for (const slug of docSlugs().filter((slug) => slug.includes('/'))) {
  const directory = join('out', slug);
  const target = href(`/docs/${slug}/`);
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    join(directory, 'index.html'),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><meta name="robots" content="noindex"><link rel="canonical" href="${target}"><title>Documentation moved · Pyreload</title></head><body><main><h1>Documentation moved</h1><a href="${target}">Continue to the documentation</a></main></body></html>`,
  );
}
