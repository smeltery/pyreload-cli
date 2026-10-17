import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { href, siteURL } from '../lib/paths';
export const metadata = {
  title: 'Brand & assets',
  alternates: { canonical: `${siteURL}/brand/` },
  openGraph: {
    title: 'Brand & assets · Pyreload',
    images: [`${siteURL}/og-image.png`],
  },
  description: 'Pyreload logos, social preview, and asset credits.',
};
export default function BrandPage() {
  return (
    <>
      <Navigation />
      <main id="main" className="wrap brand-page">
        <p className="eyebrow">Made for the loop</p>
        <h1>Brand & assets.</h1>
        <p>
          The Pyreload mark curls a Python-inspired snake into a restart loop,
          drawn for small spaces. Use the original files when linking to the
          project.
        </p>
        <h2>Logo</h2>
        <img
          src={href('/logo.svg')}
          width="100"
          height="100"
          alt="Pyreload snake restart loop logo"
        />
        <p>
          <a download href={href('/logo.svg')}>
            Download SVG logo
          </a>
        </p>
        <h2>Social preview</h2>
        <img
          src={href('/og-image.png')}
          width="1200"
          height="630"
          alt="Pyreload: Save your file. Stay in your flow."
        />
        <p>
          <a download href={href('/og-image.png')}>
            Download social image
          </a>
        </p>
        <h2 id="credits">Credits & acknowledgments</h2>
        <p>
          Original Pyreload logo and social artwork. Interface icons by{' '}
          <a href="https://lucide.dev/license">Lucide (ISC)</a>. Technology
          logos from <a href="https://simpleicons.org/">Simple Icons (CC0)</a>;
          trademarks belong to their respective owners. The Flox wordmark links
          to the project's development environment.
        </p>
        <p>
          DM Sans, Geist, and IBM Plex Mono are self-hosted under their SIL Open
          Font Licenses.
        </p>
      </main>
      <Footer />
    </>
  );
}
