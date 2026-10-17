import {
  Download,
  Fingerprint,
  Image,
  Palette,
  Type,
  Package,
  Terminal,
  RefreshCw,
  FileCode,
  Eye,
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { CopyButton } from '../components/CopyButton';
import { href, siteURL } from '../lib/paths';
import './brand.css';
export const metadata = {
  title: 'Brand & assets',
  alternates: { canonical: `${siteURL}/brand/` },
  openGraph: {
    title: 'Brand & assets · Pyreload',
    images: [`${siteURL}/og-image.png`],
  },
  description:
    'The Pyreload brand kit: snake marks, colors, typography, and social artwork.',
};
const colors = [
  ['Paper', '#f7f7f2', 'A little room to breathe.'],
  ['Charcoal', '#292b25', 'Words with clarity.'],
  ['Sage', '#526447', 'Our signature green.'],
  ['Soft sage', '#eceee5', 'A quieter surface.'],
  ['White', '#ffffff', 'A clean starting point.'],
];
const downloads = [
  ['Primary icon', 'SVG · sage background', 'logo.svg', Fingerprint],
  [
    'Standalone mark',
    'SVG · transparent background',
    'logo-mark.svg',
    RefreshCw,
  ],
  ['Light icon', 'SVG · for dark surfaces', 'logo-dark.svg', Eye],
  ['Social preview', 'PNG · 1200 × 630', 'og-image.png', Image],
  ['Social source', 'SVG · editable artwork', 'og-image.svg', FileCode],
] as const;
export default function BrandPage() {
  return (
    <>
      <Navigation />
      <main id="main" className="wrap brand-kit">
        <header className="brand-intro">
          <p className="brand-breadcrumb">Pyreload / Brand & assets</p>
          <h1>
            A familiar loop.
            <br />
            <em>A little Python.</em>
          </h1>
          <p>
            The pieces that make Pyreload feel like Pyreload. For your next
            README, project mention, or introduction to a smoother development
            loop.
          </p>
          <a className="brand-action" href="#downloads">
            <Download size={17} /> Get the assets
          </a>
        </header>
        <section className="brand-section" aria-labelledby="mark-title">
          <p className="brand-index">
            <Fingerprint size={16} /> 01 / The mark
          </p>
          <h2 id="mark-title">
            One small snake. <em>Always in motion.</em>
          </h2>
          <p>
            A curled body, a tapered tail, and a watchful eye. Our snake turns
            the restart loop into a nod to Python. Give it room and keep its
            proportions intact.
          </p>
          <div className="brand-marks">
            <figure className="brand-display">
              <img
                src={href('/logo.svg')}
                width="144"
                height="144"
                alt="Primary sage snake icon"
              />
              <figcaption>The original icon</figcaption>
            </figure>
            <figure className="brand-display brand-signature">
              <div>
                <img
                  src={href('/logo-mark.svg')}
                  width="80"
                  height="80"
                  alt=""
                />
                <strong>
                  pyreload <span>/ python</span>
                </strong>
              </div>
              <figcaption>The project signature</figcaption>
            </figure>
            <figure className="brand-display brand-dark">
              <img
                src={href('/logo-dark.svg')}
                width="88"
                height="88"
                alt="Light snake icon on charcoal"
              />
              <figcaption>After dark</figcaption>
            </figure>
            <figure className="brand-display brand-scale">
              <div>
                {[24, 40, 64].map((size) => (
                  <img
                    key={size}
                    src={href('/logo.svg')}
                    width={size}
                    height={size}
                    alt={`${size}-pixel snake icon`}
                  />
                ))}
              </div>
              <figcaption>Small by design · 24 / 40 / 64 px</figcaption>
            </figure>
          </div>
        </section>
        <section className="brand-section" aria-labelledby="social-title">
          <p className="brand-index">
            <Image size={16} /> 02 / The first impression
          </p>
          <h2 id="social-title">
            Your code, in motion. <em>Worth sharing.</em>
          </h2>
          <p>
            Python at the center. The tools around it. Our social artwork brings
            the loop together over a soft green glow.
          </p>
          <figure className="brand-social">
            <img
              src={href('/og-image.png')}
              width="1200"
              height="630"
              alt="Pyreload: Save your file. Stay in your flow. Python, Docker, terminal, and snake icons surround the headline on a textured green background."
            />
            <figcaption>
              <span>
                Social preview{' '}
                <span className="brand-dimension">/ 1200 × 630</span>
              </span>
              <a download href={href('/og-image.png')}>
                <Download size={16} /> Download PNG
              </a>
            </figcaption>
          </figure>
        </section>
        <section className="brand-section" aria-labelledby="color-title">
          <p className="brand-index">
            <Palette size={16} /> 03 / Color
          </p>
          <h2 id="color-title">
            Quiet colors. <em>Clear intent.</em>
          </h2>
          <p>
            Warm paper, grounded charcoal, and a little sage. Keep text dark on
            light surfaces; use paper or white on sage and charcoal.
          </p>
          <div className="brand-colors">
            {colors.map(([name, hex, note]) => (
              <article key={name} className="brand-swatch">
                <div style={{ background: hex }} className="brand-color-chip" />
                <div className="brand-color-label">
                  <strong>{name}</strong>
                  <div>
                    <code>{hex}</code>
                    <CopyButton text={hex} label={`Copy ${name} hex value`} />
                  </div>
                  <p>{note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="brand-section" aria-labelledby="type-title">
          <p className="brand-index">
            <Type size={16} /> 04 / Typography & icons
          </p>
          <h2 id="type-title">
            A clear voice. <em>A human touch.</em>
          </h2>
          <div className="brand-type-grid">
            <article>
              <p className="brand-index">DM Sans / Interface</p>
              <p className="brand-specimen">
                Less restarting.
                <br />
                More making.
              </p>
              <p>
                Our everyday voice for navigation, headings, and comfortable
                reading.
              </p>
            </article>
            <article>
              <p className="brand-index">Georgia / Emphasis</p>
              <p className="brand-specimen">
                <em>Stay in your flow.</em>
              </p>
              <p>A softer accent for a few well-chosen words.</p>
            </article>
            <article>
              <p className="brand-index">IBM Plex Mono / Code</p>
              <p className="brand-specimen brand-mono">pyreload app.py</p>
              <p>Commands and technical details, set clearly.</p>
            </article>
          </div>
          <div className="brand-icon-strip">
            <div aria-hidden="true">
              <Terminal />
              <FileCode />
              <RefreshCw />
              <Eye />
              <Package />
            </div>
            <p>
              Simple lines. Familiar actions.
              <br />
              <span>Lucide icons keep the interface light and legible.</span>
            </p>
          </div>
        </section>
        <section
          id="downloads"
          className="brand-section"
          aria-labelledby="downloads-title"
        >
          <p className="brand-index">
            <Package size={16} /> 05 / The toolkit
          </p>
          <h2 id="downloads-title">
            Ready for <em>your next mention.</em>
          </h2>
          <p>
            Original files, ready to use. Choose a mark for your background, or
            the social preview for a project introduction.
          </p>
          <div className="brand-downloads">
            {downloads.map(([name, detail, file, Icon]) => (
              <a key={file} download href={href('/' + file)}>
                <Icon size={24} />
                <span>
                  <strong>{name}</strong>
                  <small>{detail}</small>
                </span>
                <Download size={18} aria-label="Download" />
              </a>
            ))}
          </div>
          <aside className="brand-guidance">
            <Fingerprint size={24} />
            <div>
              <h3>A little care goes a long way.</h3>
              <p>
                Use “Pyreload” in prose. Keep the snake intact, leave clear
                space around it, and avoid stretching or adding effects. These
                assets identify the project; they don’t imply endorsement.
              </p>
            </div>
          </aside>
        </section>
        <section
          id="credits"
          className="brand-credits"
          aria-labelledby="credits-title"
        >
          <h2 id="credits-title">Credits & acknowledgments</h2>
          <p>
            Original Pyreload logo and social artwork. Interface icons by{' '}
            <a href="https://lucide.dev/license">Lucide (ISC)</a>. Technology
            logos from <a href="https://simpleicons.org/">Simple Icons (CC0)</a>
            ; trademarks belong to their respective owners. Flox artwork comes
            from the Flox project.
          </p>
          <p>
            DM Sans, Geist, and IBM Plex Mono are self-hosted under their SIL
            Open Font Licenses.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
