'use client';
import { useEffect, useRef, useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { entries } from '../lib/navigation';
import { href } from '../lib/paths';

export function Search({
  compact = false,
  shortcut = true,
  mobile = false,
}: {
  compact?: boolean;
  shortcut?: boolean;
  mobile?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const results = entries.filter(([title, slug]) =>
    `${title} ${slug}`.toLowerCase().includes(query.toLowerCase().trim()),
  );
  function open() {
    setQuery('');
    dialog.current?.showModal();
  }
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!shortcut) return;
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [shortcut]);
  return (
    <>
      <button
        className={
          mobile
            ? 'mobile-search-trigger'
            : compact
              ? 'icon-button'
              : 'header-search-trigger'
        }
        onClick={open}
        aria-label="Search documentation"
        aria-haspopup="dialog"
      >
        <SearchIcon size={18} />
        {!compact && (
          <>
            <span>{mobile ? 'Search docs & guides' : 'Search'}</span>
            <kbd>⌘ K</kbd>
          </>
        )}
      </button>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-labelledby="search-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="overlay-heading">
          <div>
            <p className="eyebrow">The Pyreload library</p>
            <h2 id="search-title">Find your next step.</h2>
          </div>
          <button
            className="close-overlay"
            onClick={() => dialog.current?.close()}
            aria-label="Close search"
          >
            <X />
          </button>
        </div>
        <label className="panel-search">
          <SearchIcon size={20} />
          <span className="sr-only">Search documentation</span>
          <input
            autoFocus
            type="search"
            placeholder="Search guides and reference"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <p className="search-count" role="status">
          {results.length} {results.length === 1 ? 'page' : 'pages'}
        </p>
        <div className="search-results-scroll">
          {results.map(([title, slug]) => (
            <a
              key={slug}
              className="search-result"
              href={href(`/docs/${slug ? `${slug}/` : ''}`)}
              onClick={() => dialog.current?.close()}
            >
              {title}
              <small>{slug.split('/')[0] || 'Documentation'}</small>
            </a>
          ))}
          {!results.length && (
            <div className="empty-state">
              <h3>No matches this time.</h3>
              <p>Try “polling”, “Docker”, or “install”.</p>
              <button onClick={() => setQuery('')}>Reset search</button>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
