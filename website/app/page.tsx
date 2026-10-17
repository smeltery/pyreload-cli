import { Code2, FolderSync, SlidersHorizontal } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { CopyButton } from './components/CopyButton';
import { href, siteURL } from './lib/paths';

export const metadata = { alternates: { canonical: `${siteURL}/` } };

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="wrap hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" />
              Your code. Back in motion.
            </p>
            <h1>
              Save your file.
              <br />
              <em>Stay in your flow.</em>
            </h1>
            <p className="lead">
              A small watcher for your Python projects. Pyreload restarts your
              app when files change, even across Docker and Vagrant mounts.
            </p>
            <div className="hero-actions">
              <a
                className="button"
                href={href('/docs/getting-started/installation/')}
              >
                Start building
              </a>
              <a className="text-link" href={href('/docs/')}>
                Read the docs
              </a>
            </div>
            <p className="hero-note">
              Python 3.8+ <span>·</span> macOS, Linux & Windows <span>·</span>{' '}
              One command
            </p>
          </div>
          <div className="terminal-stage">
            <div className="terminal">
              <div className="terminal-bar">
                <span className="traffic">
                  <i />
                  <i />
                  <i />
                </span>
                <span>~/your-next-project</span>
                <span>python</span>
              </div>
              <div className="terminal-body">
                <p>
                  <b>$</b> pip install pyreload-cli
                </p>
                <p className="terminal-muted">
                  Successfully installed pyreload-cli
                </p>
                <p>
                  <b>$</b> pyreload app.py
                </p>
                <p className="terminal-muted">Watching for changes in *.py</p>
                <p className="terminal-output">Hello, world.</p>
                <div className="terminal-event">
                  <span className="status-dot" /> app.py saved
                </div>
                <p className="terminal-green">
                  Restarting due to file changes...
                </p>
                <p className="terminal-output">
                  Hello, next idea.
                  <span className="cursor" />
                </p>
              </div>
              <div className="terminal-install">
                <code>pip install pyreload-cli</code>
                <CopyButton text="pip install pyreload-cli" />
              </div>
            </div>
            <div className="terminal-caption">
              <span>01 / THE FEEDBACK LOOP</span>
              <span>Less ceremony. More code.</span>
            </div>
          </div>
        </section>
        <div className="technology-strip wrap">
          <span>Fits right into your workspace</span>
          <div>
            {['Python', 'Docker', 'Bun', 'Flox'].map((name) => (
              <span key={name}>
                <img
                  src={href(`/${name.toLowerCase()}.svg`)}
                  width="23"
                  height="23"
                  alt=""
                />
                {name}
              </span>
            ))}
          </div>
        </div>
        <section className="wrap workflow-section" id="how-it-works">
          <div>
            <p className="eyebrow">A shorter loop</p>
            <h2>
              Make a change.
              <br />
              See what happens.
            </h2>
            <p>
              Keep your attention on the code. Pyreload handles the
              stop-and-start in between.
            </p>
            <a
              className="text-link"
              href={href('/docs/getting-started/quick-start/')}
            >
              Try the quick start
            </a>
          </div>
          <ol className="workflow-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Point it at your app</h3>
                <p>
                  Run <code>pyreload app.py</code> in your project. Python files
                  are watched by default.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Edit. Save. Repeat.</h3>
                <p>
                  Matching changes stop the current process and start it again
                  with your latest code.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Make it your own</h3>
                <p>
                  Add watch patterns, ignore noisy files, or keep project
                  defaults in a simple JSON file.
                </p>
              </div>
            </li>
          </ol>
        </section>
        <section className="capabilities">
          <div className="wrap">
            <p className="eyebrow">Small tool. Useful details.</p>
            <h2>Built for the way you develop.</h2>
            <div className="feature-grid">
              {[
                {
                  icon: FolderSync,
                  title: 'Mounts included.',
                  text: 'When native events don’t make it through, polling keeps an eye on your Docker, Vagrant, and network folders.',
                  link: 'user-guide/polling-mode',
                  label: 'Explore polling',
                },
                {
                  icon: SlidersHorizontal,
                  title: 'Only what matters.',
                  text: 'Watch Python, templates, or configuration. Ignore caches and generated files. Keep your defaults with the project.',
                  link: 'user-guide/watch-patterns',
                  label: 'Choose your patterns',
                },
                {
                  icon: Code2,
                  title: 'Beyond a script.',
                  text: 'Run a Python module or a shell command. Restart on demand with rs, or use clean mode when there’s no terminal input.',
                  link: 'advanced/exec-mode',
                  label: 'Run a command',
                },
              ].map(({ icon: Icon, title, text, link, label }) => (
                <article key={title}>
                  <Icon size={25} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a className="text-link" href={href(`/docs/${link}/`)}>
                    {label}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="wrap start-section">
          <p className="eyebrow">Your next save is the start</p>
          <h2>
            Less restarting.
            <br />
            <em>More making.</em>
          </h2>
          <div className="install-command">
            <code>pip install pyreload-cli</code>
            <CopyButton text="pip install pyreload-cli" />
          </div>
          <a
            className="text-link"
            href={href('/docs/getting-started/installation/')}
          >
            Installation guide
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
