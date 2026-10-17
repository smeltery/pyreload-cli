'use client';
import { useEffect, useId, useRef, useState } from 'react';
import {
  Search as SearchIcon,
  X,
  BookOpen,
  Code2,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
} from 'lucide-react';
import { searchEntries, suggestedEntries } from '../lib/search';
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
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('Everything');
  const search = query.toLowerCase().trim();
  const results =
    !search && scope === 'Everything'
      ? suggestedEntries
      : searchEntries.filter(
          (entry) =>
            (scope === 'Everything' || entry.kind === scope) &&
            `${entry.title} ${entry.description} ${entry.url}`
              .toLowerCase()
              .includes(search),
        );
  function open() {
    setQuery('');
    setScope('Everything');
    dialog.current?.showModal();
    input.current?.focus();
  }
  function navigateResults(event: React.KeyboardEvent<HTMLDialogElement>) {
    const target = event.target as HTMLElement;
    if (target !== input.current && !target.closest('.search-result')) return;
    const links = [
      ...(dialog.current?.querySelectorAll<HTMLAnchorElement>(
        '.search-result',
      ) || []),
    ];
    if (!links.length) return;
    const current = links.indexOf(target as HTMLAnchorElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next =
        event.key === 'ArrowDown'
          ? (current + 1) % links.length
          : current < 0
            ? links.length - 1
            : (current + links.length - 1) % links.length;
      links[next].focus();
      links[next].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && target === input.current) {
      event.preventDefault();
      links[0].click();
    }
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
        aria-labelledby={`${id}-title`}
        onKeyDown={navigateResults}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="overlay-heading">
          <div>
            <p className="eyebrow">The Pyreload library</p>
            <h2 id={`${id}-title`}>Find your next step.</h2>
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
            ref={input}
            aria-controls={`${id}-results`}
            autoComplete="off"
            spellCheck={false}
            autoFocus
            type="search"
            placeholder="Search docs, commands, or guides…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              className="clear-search"
              aria-label="Clear search"
              onClick={() => {
                setQuery('');
                input.current?.focus();
              }}
            >
              <X size={16} />
            </button>
          )}
        </label>
        <div className="search-scopes" role="group" aria-label="Search within">
          {['Everything', 'Guide', 'Reference'].map((kind) => (
            <button
              key={kind}
              aria-pressed={scope === kind}
              onClick={() => setScope(kind)}
            >
              {kind === 'Guide' ? 'Guides' : kind}
            </button>
          ))}
        </div>
        <div className="search-results-scroll">
          <p className="search-section-title" role="status">
            {!search && scope === 'Everything'
              ? 'Good places to start'
              : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}
          </p>
          <nav id={`${id}-results`} aria-label="Search results">
            {results.map(({ title, description, kind, url }) => (
              <a
                key={url}
                className="search-result"
                href={href(url)}
                onClick={() => dialog.current?.close()}
              >
                <span className="result-icon">
                  {kind === 'Reference' ? (
                    <Code2 size={20} aria-hidden="true" />
                  ) : (
                    <BookOpen size={20} aria-hidden="true" />
                  )}
                </span>
                <span className="result-copy">
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <span className="result-kind">{kind}</span>
              </a>
            ))}
          </nav>
          {!results.length && (
            <div className="empty-state">
              <h3>No matches this time.</h3>
              <p>Try “polling”, “Docker”, or “install”.</p>
              <button
                onClick={() => {
                  setQuery('');
                  setScope('Everything');
                  input.current?.focus();
                }}
              >
                Reset search
              </button>
            </div>
          )}
        </div>
        <footer className="search-footer">
          <span>Docs and guides, one search away.</span>
          <div aria-label="Keyboard shortcuts">
            <span>
              <kbd>
                <ArrowUp size={13} />
                <span className="sr-only">Up</span>
              </kbd>
              <kbd>
                <ArrowDown size={13} />
                <span className="sr-only">Down</span>
              </kbd>{' '}
              Move
            </span>
            <span>
              <kbd>
                <CornerDownLeft size={13} />
                <span className="sr-only">Enter</span>
              </kbd>{' '}
              Open
            </span>
            <span>
              <kbd>esc</kbd> Close
            </span>
          </div>
        </footer>
      </dialog>
    </>
  );
}
