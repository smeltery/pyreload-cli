import { Brand } from './Brand';
import { href, repository } from '../lib/paths';
const columns = [
  [
    'The library',
    [
      ['All documentation', '/docs/'],
      ['CLI reference', '/docs/api/'],
      ['Examples', '/docs/use-cases/docker/'],
    ],
  ],
  [
    'Resources',
    [
      ['Brand & assets', '/brand/'],
      ['Getting started', '/docs/getting-started/installation/'],
      ['How it works', '/#how-it-works'],
      ['Development', '/docs/development/'],
      ['Contributing', `${repository}/blob/master/CONTRIBUTING.md`],
    ],
  ],
  [
    'In the open',
    [
      ['About Smeltery', 'https://github.com/smeltery'],
      ['GitHub repository', repository],
      ['Feedback & issues', `${repository}/issues`],
      ['Releases', `${repository}/releases`],
      ['Credits & acknowledgments', '/brand/#credits'],
    ],
  ],
] as const;
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand />
            <p>
              A little less restarting.
              <br />A lot more building.
            </p>
            <span>A small Python tool for thoughtful builders.</span>
          </div>
          {columns.map(([title, links]) => (
            <nav key={title} aria-label={`Footer ${title}`}>
              <h2>{title}</h2>
              {links.map(([label, url]) => (
                <a key={label} href={url.startsWith('/') ? href(url) : url}>
                  {label}
                </a>
              ))}
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Smeltery</span>
          <a href={`${repository}/blob/master/LICENSE`}>
            PolyForm Shield license
          </a>
          <span className="footer-note">Built for the way you work.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
