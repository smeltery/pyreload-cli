import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { href } from './lib/paths';
export default function NotFound() {
  return (
    <>
      <Navigation />
      <main id="main" className="wrap brand-page">
        <p className="eyebrow">404 / Page not found</p>
        <h1>Back to a fresh start.</h1>
        <p>
          This page doesn’t exist. Find the guide you need in the documentation.
        </p>
        <a className="button" href={href('/docs/')}>
          Explore documentation
        </a>
      </main>
      <Footer />
    </>
  );
}
