import { siteURL } from './lib/paths';
export const dynamic = 'force-static';
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteURL}/sitemap.xml`,
  };
}
