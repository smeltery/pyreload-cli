import type { Metadata } from 'next';
import { siteURL } from './lib/paths';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(`${siteURL}/`),
  title: {
    default: 'Pyreload — Save your file. Stay in your flow.',
    template: '%s · Pyreload',
  },
  description:
    'Automatically restart Python applications when files change. Native events for local projects. Polling for Docker, Vagrant, and mounted filesystems.',
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon.svg` },
  openGraph: {
    title: 'Pyreload — Save your file. Stay in your flow.',
    description: 'A small watcher for your Python projects.',
    type: 'website',
    images: [
      {
        url: `${siteURL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Pyreload: Save your file. Stay in your flow.',
      },
    ],
  },
  twitter: { card: 'summary_large_image', images: [`${siteURL}/og-image.png`] },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body id="top">
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
