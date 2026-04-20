import { getJobCount } from '@/lib/services/jobService';

export default async function Footer() {
  // Keep the site rendering even if the DB is briefly unreachable (CI build
  // without a DB, cold start edge cases, etc.). Return null count and let
  // the markup drop the "N curated roles" line rather than crash the layout.
  let count: number | null = null;
  try {
    count = await getJobCount();
  } catch {
    count = null;
  }

  return (
    <footer className="footer">
      <small>
        <p>
          Driftwork · built by{' '}
          <a href="https://github.com/HariYenuganti" target="_blank">
            Hari Yenuganti
          </a>
        </p>
      </small>

      {count !== null && (
        <p>
          <span className="u-bold">{count.toLocaleString()}</span>{' '}
          {count === 1 ? 'curated role' : 'curated roles'}
        </p>
      )}
    </footer>
  );
}
