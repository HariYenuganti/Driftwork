import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import JobItemContent from '@/components/JobItemContent';
import { getJobById } from '@/lib/services/jobService';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const jobItem = await getJobById(id);
  if (!jobItem) return { title: 'Driftwork — Job not found' };
  return {
    title: `${jobItem.title} at ${jobItem.company} — Driftwork`,
    description: jobItem.description.slice(0, 155),
  };
}

export default async function DetailPage({ params }: Props) {
  const { id } = await params;
  const jobItem = await getJobById(id);
  if (!jobItem) notFound();

  return <JobItemContent jobItem={jobItem} />;
}
