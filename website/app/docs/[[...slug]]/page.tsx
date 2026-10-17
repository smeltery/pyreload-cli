import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { docSlugs, readDoc } from '../../lib/docs';
import { href, siteURL } from '../../lib/paths';
import { entries } from '../../lib/navigation';
import { DocsShell } from '../../components/DocsShell';

type Props = { params: Promise<{ slug?: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return docSlugs().map((slug) => ({ slug: slug ? slug.split('/') : [] }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug?.join('/') || '';
  if (!docSlugs().includes(slug)) return {};
  const doc = readDoc(slug);
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `${siteURL}/docs/${slug ? `${slug}/` : ''}` },
    openGraph: {
      title: `${doc.title} · Pyreload`,
      description: doc.description,
      images: [`${siteURL}/og-image.png`],
    },
  };
}
export default async function DocPage({ params }: Props) {
  const slug = (await params).slug?.join('/') || '';
  if (!docSlugs().includes(slug)) notFound();
  const doc = readDoc(slug);
  const current = entries.findIndex((entry) => entry[1] === slug);
  const previous = entries[current - 1];
  const next = entries[current + 1];
  return (
    <DocsShell slug={slug} headings={doc.headings} markdown={doc.markdown}>
      <div
        className={slug === 'api' ? 'reference-page' : undefined}
        dangerouslySetInnerHTML={{ __html: doc.html }}
      />
      <nav className="doc-pagination" aria-label="Pagination">
        {previous && (
          <a href={href(`/docs/${previous[1] ? `${previous[1]}/` : ''}`)}>
            <small>Previous</small>
            {previous[0]}
          </a>
        )}
        {next && (
          <a href={href(`/docs/${next[1]}/`)}>
            <small>Next</small>
            {next[0]}
          </a>
        )}
      </nav>
    </DocsShell>
  );
}
