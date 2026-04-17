import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Providers from './providers';
import Background from '@/components/Background';
import Footer from '@/components/Footer';
import Header, { HeaderTop } from '@/components/Header';
import Logo from '@/components/Logo';
import BookmarksButton from '@/components/BookmarksButton';
import SubmitJobLink from '@/components/SubmitJobLink';
import SearchForm from '@/components/SearchForm';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Driftwork — Remote engineering jobs that find you',
  description:
    'A curated remote job board for developers. Fast search, smart filters, bookmarks that survive a refresh.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Providers>
          <Background />
          <Header>
            <HeaderTop>
              <Logo />
              <SubmitJobLink />
              <BookmarksButton />
            </HeaderTop>
            <Suspense fallback={null}>
              <SearchForm />
            </Suspense>
          </Header>
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
