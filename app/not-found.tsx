import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driftwork — Page not found',
  robots: { index: false, follow: false },
};

// Force dynamic rendering so the root layout's <Footer /> can query Prisma
// at request time (not during prerender). Also keeps the count accurate
// rather than frozen at the moment of build.
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Drifted off the map</h1>
      <p className="not-found__message">
        This role may have been taken down, or the link is off by a digit or two.
      </p>
      <div className="not-found__actions">
        <Link href="/" className="not-found__link">
          Back to search
        </Link>
        <Link href="/submit" className="not-found__link not-found__link--muted">
          Post a role
        </Link>
      </div>
    </section>
  );
}
