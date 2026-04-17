// The sidebar stays mounted when the user navigates to /jobs/[id].
// Render the same content as the root page (search + list); the detail
// view lives in the @detail parallel slot.
import type { Metadata } from 'next';
import { getJobById } from '@/lib/services/jobService';

export { default } from '../../page';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const jobItem = await getJobById(id);

  if (!jobItem) {
    return {
      title: 'Driftwork — Job not found',
      robots: { index: false, follow: false },
    };
  }

  const title = `${jobItem.title} at ${jobItem.company} — Driftwork`;
  const description = jobItem.description.slice(0, 155);
  const images = jobItem.coverImgURL
    ? [
        {
          url: jobItem.coverImgURL,
          width: 1200,
          height: 630,
          alt: `${jobItem.title} at ${jobItem.company}`,
        },
      ]
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Driftwork',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: jobItem.coverImgURL ? [jobItem.coverImgURL] : undefined,
    },
  };
}
