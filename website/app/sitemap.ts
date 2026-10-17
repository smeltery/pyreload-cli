import { docSlugs } from './lib/docs';
import { siteURL } from './lib/paths';
export const dynamic = 'force-static';
export default function sitemap() {
  return [
    '/',
    '/brand/',
    ...docSlugs().map((slug) => `/docs/${slug ? `${slug}/` : ''}`),
  ].map((route) => ({ url: `${siteURL}${route}` }));
}
