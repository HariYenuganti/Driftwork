import { notFound } from 'next/navigation';
import JobItemContent from '@/components/JobItemContent';
import { getJobById } from '@/lib/services/jobService';

// Metadata for this URL lives in the companion main route page
// (../../jobs/[id]/page.tsx) so it bubbles up to the document head correctly
// — parallel slot metadata is not merged into the <head> by Next.js.

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DetailPage({ params }: Props) {
  const { id } = await params;
  const jobItem = await getJobById(id);
  if (!jobItem) notFound();

  return <JobItemContent jobItem={jobItem} />;
}
