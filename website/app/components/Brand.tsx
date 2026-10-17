import { href } from '../lib/paths';
export function Brand({ docs = false }: { docs?: boolean }) {
  return (
    <a className="brand" href={href('/')} aria-label="Pyreload home">
      {/* The SVG is a local original mark. */}
      <img src={href('/logo.svg')} width="32" height="32" alt="" />
      <span>
        pyreload{!docs && <span className="brand-sub"> / python</span>}
      </span>
    </a>
  );
}
