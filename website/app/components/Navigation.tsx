'use client';
import { useRef } from 'react';
import { BookOpen, Compass, Grid2X2, Menu, X, Code2 } from 'lucide-react';
import { Brand } from './Brand';
import { Search } from './Search';
import { entries, groups } from '../lib/navigation';
import { href, repository } from '../lib/paths';

export function Navigation() {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <header className="site-header">
        <div className="wrap header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href={href('/docs/')}>Explore docs</a>
            <a href={href('/docs/getting-started/installation/')}>
              Getting started
            </a>
            <a href={href('/#how-it-works')}>How it works</a>
          </nav>
          <Search />
          <a className="github-link" href={repository}>
            <img src={href('/github.svg')} width="18" height="18" alt="" />
            GitHub
          </a>
          <button
            className="menu-toggle"
            onClick={() => dialog.current?.showModal()}
            aria-haspopup="dialog"
          >
            Menu <Menu size={18} />
          </button>
        </div>
      </header>
      <dialog ref={dialog} className="mobile-dialog" aria-label="Navigation">
        <div className="mobile-panel-heading">
          <Brand />
          <button
            autoFocus
            className="close-overlay"
            onClick={() => dialog.current?.close()}
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>
        <div className="mobile-panel-body">
          <p className="eyebrow">
            A little less restarting. A lot more building.
          </p>
          <h2>What’s next?</h2>
          <Search mobile shortcut={false} />
          <nav
            aria-label="Mobile navigation"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('a'))
                dialog.current?.close();
            }}
          >
            <a className="mobile-feature-card" href={href('/docs/')}>
              <span className="nav-card-icon">
                <Grid2X2 size={20} />
              </span>
              <span>
                <strong>Explore docs</strong>
                <small>Find a guide for the work ahead.</small>
              </span>
              <span className="nav-count">{entries.length}</span>
            </a>
            <div className="mobile-resource-grid">
              <a href={href('/docs/getting-started/installation/')}>
                <BookOpen size={22} />
                <strong>Getting started</strong>
                <small>From install to your first restart.</small>
              </a>
              <a href={href('/#how-it-works')}>
                <Compass size={22} />
                <strong>How it works</strong>
                <small>A small tool for a shorter feedback loop.</small>
              </a>
            </div>
          </nav>
          <section className="mobile-tasks">
            <div className="mobile-section-label">
              <h3>Browse by task</h3>
              <span>Start with an outcome</span>
            </div>
            <nav aria-label="Documentation categories">
              {groups.slice(0, 5).map((group) => (
                <a key={group.title} href={href(`/docs/${group.links[0][1]}/`)}>
                  <span className="nav-card-icon">
                    <Code2 size={20} />
                  </span>
                  {group.title}
                  <small>{group.links.length} guides</small>
                </a>
              ))}
            </nav>
          </section>
          <div className="mobile-starter">
            <p className="eyebrow">Not sure where to begin?</p>
            <h3>Start with a single file.</h3>
            <p>Run your app, save a change, and see it restart.</p>
            <a href={href('/docs/getting-started/quick-start/')}>
              Read the quick start
            </a>
          </div>
        </div>
        <div className="mobile-panel-footer">
          <a href={repository}>GitHub</a>
          <a href={`${repository}/issues`}>Feedback & issues</a>
          <span>Made to fit your day.</span>
        </div>
      </dialog>
    </>
  );
}
