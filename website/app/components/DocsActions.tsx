'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ChevronDown, ExternalLink } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { href, siteURL } from '../lib/paths';

export function DocsActions({
  markdown,
  slug,
}: {
  markdown: string;
  slug: string;
}) {
  const dropdown = useRef<HTMLDetailsElement>(null);
  const [origin, setOrigin] = useState(new URL(siteURL).origin);
  useEffect(() => setOrigin(window.location.origin), []);
  const prompt = `Read ${origin}${href(`/docs/${slug ? `${slug}/` : ''}`)} so I can ask you questions about this page.`;
  const query = encodeURIComponent(prompt);
  const providers = [
    ['v0', 'v0', `https://v0.app/?q=${query}`],
    ['chatgpt', 'ChatGPT', `https://chatgpt.com/?hints=search&prompt=${query}`],
    ['claude', 'Claude', `https://claude.ai/new?q=${query}`],
    ['t3', 'T3 Chat', `https://t3.chat/new?q=${query}`],
    ['scira', 'Scira', `https://scira.ai/?q=${query}`],
    ['cursor', 'Cursor', `https://cursor.com/link/prompt?text=${query}`],
  ];
  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (dropdown.current && !dropdown.current.contains(event.target as Node))
        dropdown.current.open = false;
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);
  return (
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
        <ArrowUp size={16} aria-hidden="true" />
        Scroll to top
      </button>
      <CopyButton text={markdown} label="Copy as Markdown" />
      <details
        ref={dropdown}
        className="chat-links"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && dropdown.current) {
            dropdown.current.open = false;
            dropdown.current.querySelector('summary')?.focus();
          }
        }}
      >
        <summary>
          <ExternalLink size={16} aria-hidden="true" />
          Open in chat
          <ChevronDown size={14} className="chat-chevron" aria-hidden="true" />
        </summary>
        <div className="chat-menu">
          {providers.map(([id, name, url]) => (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-describedby="chat-new-tab"
            >
              <span
                className="chat-provider-icon"
                style={{ maskImage: `url(${href(`/chat/${id}.svg`)})` }}
                aria-hidden="true"
              />
              <span>Open in {name}</span>
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          ))}
        </div>
        <span id="chat-new-tab" className="sr-only">
          Opens in a new tab
        </span>
      </details>
    </div>
  );
}
