import {
  Check,
  Minus,
  FileCode,
  SlidersHorizontal,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { highlight } from '../lib/highlight';
import { CopyButton } from './CopyButton';
import { href } from '../lib/paths';
const config = `{
  "watch": ["*.py", "*.html"],
  "ignore": ["*.log", "*__pycache__*"]
}`;
const questions = [
  [
    'Do I need to change my application?',
    'No. Run your existing script with pyreload app.py. Pyreload watches files from the current directory and manages restarting the child process.',
    'getting-started/quick-start',
    'Get started',
  ],
  [
    'Can I watch templates and configuration too?',
    'Yes. Repeat --watch to include patterns such as *.html or *.yaml, or keep your watch and ignore lists in a project configuration file.',
    'user-guide/watch-patterns',
    'Choose watch patterns',
  ],
  [
    'What if changes in Docker are not detected?',
    'Try --polling inside the container. Some mounted filesystems do not forward native change events. Polling checks for changes periodically, at the cost of additional CPU use.',
    'use-cases/docker',
    'Set up Docker',
  ],
  [
    'How do I restart without saving a file?',
    'Type rs and press Enter in the running terminal. Type help for interactive commands. In clean mode, terminal input is disabled.',
    'user-guide/commands',
    'See interactive commands',
  ],
  [
    'Does this replace a production process manager?',
    'Pyreload is built for the development loop. It restarts its immediate child process; it does not supervise a full process tree or provide production deployment orchestration.',
    'advanced/exec-mode',
    'Understand process handling',
  ],
];
export function WatchConfiguration() {
  return (
    <section className="watch-section">
      <div className="wrap watch-layout">
        <div className="watch-copy">
          <p className="eyebrow">
            <SlidersHorizontal size={16} aria-hidden="true" /> Less noise. More
            intention.
          </p>
          <h2>
            Watch the work.
            <br />
            <em>Skip the noise.</em>
          </h2>
          <p>
            Templates count. Logs don’t have to. Keep your watch and ignore
            rules in a small JSON file, right next to your code.
          </p>
          <a
            className="text-link"
            href={href('/docs/user-guide/config-files/')}
          >
            Make it a project default
          </a>
          <p className="watch-footnote">
            Save as <code>.pyreloadrc</code> in your project, then run{' '}
            <code>pyreload app.py</code>.
          </p>
        </div>
        <div className="watch-example">
          <div className="watch-file-header">
            <span>
              <FileCode size={16} aria-hidden="true" />
              .pyreloadrc
            </span>
            <CopyButton text={config} label="Copy example configuration" />
          </div>
          <pre>
            <code
              className="syntax-code"
              dangerouslySetInnerHTML={{ __html: highlight(config, 'json') }}
            />
          </pre>
          <div className="watch-outcomes">
            <p className="watch-example-label">With these rules</p>
            {[
              ['app.py', true],
              ['templates/index.html', true],
              ['debug.log', false],
              ['__pycache__/app.pyc', false],
            ].map(([file, included]) => (
              <div key={String(file)}>
                <code>{file}</code>
                <span className={included ? 'watch-included' : 'watch-ignored'}>
                  {included ? (
                    <Check size={14} aria-hidden="true" />
                  ) : (
                    <Minus size={14} aria-hidden="true" />
                  )}
                  {included ? 'Restarts' : 'Ignored'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export function HomeFAQ() {
  return (
    <section className="wrap home-faq" aria-labelledby="faq-title">
      <div>
        <p className="eyebrow">
          <MessageCircle size={16} aria-hidden="true" /> A few things worth
          knowing
        </p>
        <h2 id="faq-title">
          Small questions.
          <br />
          <em>Clear answers.</em>
        </h2>
        <p>
          Everything else is in the docs, from your first command to the details
          of process handling.
        </p>
        <a className="text-link" href={href('/docs/')}>
          Explore the documentation
        </a>
      </div>
      <div className="faq-questions">
        {questions.map(([question, answer, route, label]) => (
          <details key={question}>
            <summary>
              {question}
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <div>
              <p>{answer}</p>
              <a className="text-link" href={href(`/docs/${route}/`)}>
                {label}
              </a>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
