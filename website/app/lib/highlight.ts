import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import python from 'highlight.js/lib/languages/python';
import json from 'highlight.js/lib/languages/json';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import yaml from 'highlight.js/lib/languages/yaml';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('bash', (api) => {
  const language = bash(api);
  const keywords = language.keywords as Record<string, string>;
  language.keywords = {
    ...keywords,
    built_in: `${keywords.built_in || ''} pyreload pip python bun uv flox`,
  };
  return language;
});
for (const [name, grammar] of Object.entries({
  python,
  json,
  dockerfile,
  yaml,
  typescript,
}))
  hljs.registerLanguage(name, grammar);
export function highlight(code: string, language: string): string {
  return hljs.getLanguage(language)
    ? hljs.highlight(code, { language, ignoreIllegals: true }).value
    : code
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}
