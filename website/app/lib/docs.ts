import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import { highlight } from './highlight';
import { href } from './paths';

const root = path.resolve(process.cwd(), '../docs/src');
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
export function docSlugs(directory = root): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory()
      ? docSlugs(file)
      : entry.name.endsWith('.md')
        ? [
            path
              .relative(root, file)
              .replace(/\.md$/, '')
              .replace(/(^|\/)index$/, ''),
          ]
        : [];
  });
}
export function readDoc(slug: string) {
  const candidate = path.join(root, slug || 'index');
  const file = fs.existsSync(`${candidate}.md`)
    ? `${candidate}.md`
    : path.join(candidate, 'index.md');
  const markdown = fs.readFileSync(file, 'utf8');
  const title = markdown.match(/^# (.+)$/m)?.[1] || 'Documentation';
  const headings = [...markdown.matchAll(/^## (.+)$/gm)].map((match) => ({
    text: match[1],
    id: slugify(match[1]),
  }));
  const renderer = new MarkdownIt({
    html: false,
    linkify: true,
    highlight,
  }).use(anchor, {
    slugify,
  });
  const fence = renderer.renderer.rules.fence!;
  renderer.renderer.rules.fence = (tokens, index, options, env, self) => {
    if (tokens[index].info.trim() !== 'mermaid')
      return fence(tokens, index, options, env, self);
    const source = tokens[index].content;
    const hash = createHash('sha256').update(source).digest('hex').slice(0, 12);
    return `<figure class="doc-diagram"><img src="${href(`/diagrams/${hash}.svg`)}" alt="${renderer.utils.escapeHtml(title)} workflow diagram" /><details><summary>Diagram source</summary><pre>${renderer.utils.escapeHtml(source)}</pre></details></figure>`;
  };
  renderer.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const url = String(tokens[index].attrGet('href') || '');
    if (!/^(?:[a-z]+:|#|\/)/i.test(url)) {
      const [relative, fragment] = url.split('#');
      const target = path.posix
        .normalize(
          path.posix.join(path.relative(root, path.dirname(file)), relative),
        )
        .replace(/\.md$/, '')
        .replace(/(^|\/)index$/, '');
      tokens[index].attrSet(
        'href',
        href(
          `/docs/${target ? `${target}/` : ''}${fragment ? `#${fragment}` : ''}`,
        ),
      );
    }
    return self.renderToken(tokens, index, options);
  };
  let html = renderer
    .render(markdown)
    .replaceAll('<table>', '<div class="table-scroll"><table>')
    .replaceAll('</table>', '</table></div>');
  if (slug === 'api') {
    html = html.replace(
      /<li><a href="([^"]+)">([^<]+)<\/a>: ([^<]+)<\/li>/g,
      (_, url, label, description) =>
        `<li><a href="${url}"><span class="method">${label.includes('onfig') ? 'JSON' : 'CLI'}</span><span><strong>${label}</strong><small>${description}</small></span></a></li>`,
    );
  }
  return {
    markdown,
    html,
    title,
    headings,
    description: markdown
      .split('\n\n')
      .find((block) => !block.startsWith('#'))
      ?.replaceAll('\n', ' '),
  };
}
