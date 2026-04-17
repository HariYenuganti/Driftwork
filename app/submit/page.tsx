import type { Metadata } from 'next';
import Link from 'next/link';
import SubmitJobForm from '@/components/SubmitJobForm';

export const metadata: Metadata = {
  title: 'Submit a role — Driftwork',
  description:
    'Post a remote developer job to Driftwork. Appears in search immediately.',
};

export default function SubmitPage() {
  return (
    <section className="submit-page">
      <header className="submit-page__header">
        <Link href="/" className="submit-page__back">
          ← Back
        </Link>
        <h1 className="submit-page__title">Post a remote role</h1>
        <p className="submit-page__subtitle">
          Fill in the fields and your job appears in search immediately.
          No account required.
        </p>
      </header>
      <SubmitJobForm />
    </section>
  );
}
