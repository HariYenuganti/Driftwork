import { getJobCount } from '@/lib/services/jobService';

export default async function Footer() {
  const count = await getJobCount();
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

      <p>
        <span className="u-bold">{count.toLocaleString()}</span>{' '}
        {count === 1 ? 'curated role' : 'curated roles'}
      </p>
    </footer>
  );
}
