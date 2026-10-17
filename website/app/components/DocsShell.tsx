'use client';
import { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Sun, X, ArrowUp } from 'lucide-react';
import { Brand } from './Brand';
import { Search } from './Search';
import { CopyButton } from './CopyButton';
import { groups } from '../lib/navigation';
import { href, siteURL } from '../lib/paths';

export function DocsShell({
  slug,
  headings,
  markdown,
  children,
}: {
  slug: string;
  headings: { text: string; id: string }[];
  markdown: string;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState('dark');
  const drawer = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    try {
      setTheme(localStorage.getItem('pyreload-theme') || 'dark');
    } catch {
      /* Storage can be disabled. */
    }
  }, []);
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('pyreload-theme', next);
    } catch {
      /* Theme still works for this visit. */
    }
  }
  const reference = slug.startsWith('api');
  const navigation = reference
    ? [
        {
          title: 'Commands',
          links: [
            ['CLI reference', 'api/cli-reference'],
            ['Interactive commands', 'user-guide/commands'],
          ],
        },
        {
          title: 'Configuration',
          links: [
            ['Configuration reference', 'api/config-reference'],
            ['Configuration files', 'user-guide/config-files'],
          ],
        },
      ]
    : groups;
  const prompt = encodeURIComponent(
    `Read ${siteURL}/docs/${slug ? `${slug}/` : ''} so I can ask questions about it.`,
  );
  const chatLinks = [
    ['v0', `https://v0.app/?q=${prompt}`],
    ['ChatGPT', `https://chatgpt.com/?hints=search&prompt=${prompt}`],
    ['Claude', `https://claude.ai/new?q=${prompt}`],
    ['T3 Chat', `https://t3.chat/new?q=${prompt}`],
    ['Scira', `https://scira.ai/?q=${prompt}`],
    ['Cursor', `https://cursor.com/link/prompt?text=${prompt}`],
  ];
  const sidebar = (
    <nav className="docs-sidebar" aria-label="Documentation">
      <a
        href={href(reference ? '/docs/api/' : '/docs/')}
        aria-current={slug === '' || slug === 'api' ? 'page' : undefined}
      >
        Overview
      </a>
      {navigation.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          {group.links.map(([title, route]) => (
            <a
              key={route}
              href={href(`/docs/${route}/`)}
              aria-current={slug === route ? 'page' : undefined}
            >
              {title}
            </a>
          ))}
        </section>
      ))}
    </nav>
  );
  return (
    <div className="docs-shell" data-theme={theme}>
      <header className="docs-header">
        <Brand docs />
        <nav aria-label="Sections">
          <a
            href={href('/docs/')}
            aria-current={
              !slug.startsWith('api') && !slug.startsWith('use-cases')
                ? 'page'
                : undefined
            }
          >
            Docs
          </a>
          <a
            href={href('/docs/api/')}
            aria-current={slug.startsWith('api') ? 'page' : undefined}
          >
            CLI reference
          </a>
          <a
            href={href('/docs/use-cases/docker/')}
            aria-current={slug.startsWith('use-cases') ? 'page' : undefined}
          >
            Examples
          </a>
        </nav>
        <div className="docs-controls">
          <Search compact />
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            className="icon-button docs-mobile-toggle"
            onClick={() => drawer.current?.showModal()}
            aria-label="Open documentation navigation"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>
      {sidebar}
      <dialog
        ref={drawer}
        className="docs-drawer"
        aria-label="Documentation navigation"
      >
        <button
          className="close-overlay"
          onClick={() => drawer.current?.close()}
          aria-label="Close navigation"
        >
          <X />
        </button>
        {sidebar}
      </dialog>
      <main id="main" className="docs-main">
        <article className="docs-article">{children}</article>
      </main>
      <aside className="docs-toc" aria-label="On this page">
        <h2>On this page</h2>
        {headings.map((heading) => (
          <a key={heading.id} href={`#${heading.id}`}>
            {heading.text}
          </a>
        ))}
        <div className="toc-actions">
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
                  .matches
                  ? 'instant'
                  : 'smooth',
              })
            }
          >
            <ArrowUp size={15} />
            Scroll to top
          </button>
          <CopyButton text={markdown} label="Copy as Markdown" />
          <details className="chat-links">
            <summary>Open in chat</summary>
            {chatLinks.map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
              </a>
            ))}
          </details>
        </div>
      </aside>
    </div>
  );
}
