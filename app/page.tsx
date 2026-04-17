import Sidebar from '@/components/Sidebar';
import { searchJobs } from '@/lib/services/jobService';

type Props = {
  searchParams: Promise<{ search?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { search = '' } = await searchParams;
  const jobItems = await searchJobs(search);

  return <Sidebar jobItems={jobItems} />;
}
